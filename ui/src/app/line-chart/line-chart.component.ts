import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { SocketService } from '../socket.service';

import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as d3Brush from 'd3-brush';
import * as randomColor from 'randomcolor';
import { CommentDialogComponent } from '../comment-dialog/comment-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {

  title = 'Line Chart';
  data: any[] = [];

  private margin = { top: 20, right: 20, bottom: 30, left: 50 };
  private width: number;
  private height: number;
  private x: d3Scale.ScaleTime<number, number>;
  private y: d3Scale.ScaleLinear<number, number>;
  // private xAxis: any;
  // private yAxis: any;
  private svg: any;
  private line: any;
  clip: any;
  brush: any;
  yMark = 0;

  constructor(private apiService: ApiService, public dialog: MatDialog, private socketService: SocketService) {
    this.width = 960 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
  }

  ngOnInit() {
    this.apiService.getChartData().subscribe((data: any[]) => {
      data = data.map((x) => ({ ...x, date: new Date(x.date) }));
      this.data = data;
      this.buildSvg();
      this.addXandYAxis();
      this.addBrushAndLine();
      this.drawLineAndPath();
      this.socketService.getNewComment()
        .subscribe(newComment => {
          this.addLine(newComment.x1, newComment.x2, newComment.color);
        });
      this.socketService.getAllComments()
        .subscribe(allComments => {
          allComments.forEach(c => this.addLine(c.x1, c.x2, c.color));
        });
    });
  }

  private buildSvg() {
    this.svg = d3.select('svg')
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  private addXandYAxis() {
    // range of data configuring
    this.x = d3Scale.scaleTime().range([0, this.width]);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.x.domain(d3Array.extent(this.data, (d) => d.date));
    this.y.domain(d3Array.extent(this.data, (d) => d.close));

    // Configure the Y Axis
    this.svg.append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3Axis.axisBottom(this.x));
    // Configure the Y Axis
    this.svg.append('g')
      .attr('class', 'axis axis--y')
      .call(d3Axis.axisLeft(this.y));
  }

  private addBrushAndLine() {
    this.brush = d3Brush.brushX()                   // Add the brush feature using the d3.brush function
      .extent([[0, 0], [this.width, this.height]])  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on("end", () => {
        let extent = d3.event.selection;
        if (extent) {
          const d1 = this.x.invert(extent[0]);
          const d2 = this.x.invert(extent[1]);
          this.openPopup(d1, d2, extent);
        }
      })               // Each time the brush selection changes, trigger the 'updateChart' function

    this.svg.select().call(this.brush);

    // Add the brushing
    this.svg
      .append("g")
      .call(this.brush);
  }

  private drawLineAndPath() {
    this.svg.append("path")
      .datum(this.data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3Shape.line()
        .x((d: any) => this.x(d.date))
        .y((d: any) => this.y(d.close))
      );
  }

  private addLine(x1: number, x2: number, color: string) {
    const yMark = 10 * this.yMark++;
    this.svg.append("line")          // attach a line
      .style("stroke", color)  // colour the line
      .attr("stroke-width", 5)
      .attr("x1", x1)     // x position of the first end of the line
      .attr("y1", yMark)      // y position of the first end of the line
      .attr("x2", x2)     // x position of the second end of the line
      .attr("y2", yMark);
  }

  private openPopup(d1: Date, d2: Date, [x1, x2]: number[]) {
    const dialogRef = this.dialog.open(CommentDialogComponent, {
      width: '500px',
      data: { d1, d2, x1, x2, color: randomColor() }
    });
    // dialogRef.afterClosed().subscribe(data => {
    //   if (data) {
    //     this.addLine(data.x1, data.x2, data.color);
    //   }
    // });
  }

}

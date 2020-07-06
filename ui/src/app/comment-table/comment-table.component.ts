import { Component, OnInit } from '@angular/core';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-comment-table',
  templateUrl: './comment-table.component.html',
  styleUrls: ['./comment-table.component.scss']
})
export class CommentTableComponent implements OnInit {

  allComments: any[];

  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    this.socketService.getAllComments()
      .subscribe(allComments => {
        this.allComments = allComments;
      });

    this.socketService.getNewComment()
      .subscribe(comment => {
        this.allComments.push(comment);
      });
  }

}

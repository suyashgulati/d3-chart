import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../api.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-comment-dialog',
  templateUrl: './comment-dialog.component.html',
  styleUrls: ['./comment-dialog.component.scss']
})
export class CommentDialogComponent implements OnInit {
  comments: string[];
  form: FormGroup = new FormGroup({
    newComment: new FormControl(null),
  });

  get newComment() { return this.form.get('newComment').value; }

  constructor(
    private apiService: ApiService,
    public dialogRef: MatDialogRef<CommentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { d1: Date, d2: Date, x1: number, x2: number, color: string }) { }

  ngOnInit() {
    this.getComments();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getComments() {
    this.apiService.getComments(this.data.d1, this.data.d2).subscribe((comments: string[]) => {
      this.comments = comments || [];
    });
  }

  addComment() {
    if (this.newComment) {
      this.apiService.postComment(this.data.d1, this.data.d2, this.newComment, this.data.x1, this.data.x2, this.data.color).subscribe(() => {
        this.form.reset();
        this.dialogRef.close(this.data);
      });
    }
  }

}

import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socket: Socket) { }

  getNewComment() {
    return this.socket
      .fromEvent<any>('new-comment')
      .pipe(map(data => data));
  }

  getAllComments() {
    return this.socket
      .fromEvent<any[]>('all-comments')
      .pipe(map(data => data), first());
  }
}

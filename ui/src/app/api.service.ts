import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getChartData() {
    return this.http.get(`${environment.apiUrl}api/chart-data`);
  }

  getComments(d1: Date, d2: Date) {
    return this.http.get(`${environment.apiUrl}api/comment?d1=${d1}&d2=${d2}`);
  }

  postComment(d1: Date, d2: Date, comment: string, x1: number, x2: number, color: string) {
    return this.http.post(`${environment.apiUrl}api/comment`, { d1, d2, comment, x1, x2, color });
  }
}

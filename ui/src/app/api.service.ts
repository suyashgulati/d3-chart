import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getChartData() {
    return this.http.get(`${environment.apiUrl}chart-data`);
  }

  getComments(d1: Date, d2: Date) {
    return this.http.get(`${environment.apiUrl}comment?d1=${d1}&d2=${d2}`);
  }

  postComment(d1: Date, d2: Date, comment: string) {
    return this.http.post(`${environment.apiUrl}comment`, { d1, d2, comment });
  }
}

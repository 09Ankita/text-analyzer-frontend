import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TextModel } from './text-analyzer/text-model';

@Injectable({
  providedIn: 'root'
})
export class TextAnalyzerService {
  private apiBaseUrl: string = 'http://localhost:8080/';

  constructor(private http: HttpClient) { }

  public checkAPIStatus() : Observable<any> {
    return this.http.get(this.apiBaseUrl, {responseType: 'text'});
  }

  public getAnalysisReport(textModel: TextModel): Observable<any> {
    return this.http.post<TextModel>(this.apiBaseUrl+'analyze/', textModel);
  }
}

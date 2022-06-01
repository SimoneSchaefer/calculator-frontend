import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalulcatorService {

  constructor(private httpClient: HttpClient) { }

  calculate(formula: string): Observable<number> {
    return this.httpClient.put<number>(`calculate`, { formula: formula });
  }
}

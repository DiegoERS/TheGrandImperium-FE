import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { promotionDTO } from '../models/PromotionDTO';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class promotionService {
  private readonly apiUrl = `${environment.apiUrl}/Promotion`;

  private http = inject(HttpClient);

  getAll(): Observable<promotionDTO[]> {
    return this.http.get<promotionDTO[]>(`${this.apiUrl}`);
  }

  getById(id: number): Observable<promotionDTO> {
    return this.http.get<promotionDTO>(`${this.apiUrl}/${id}`);
  }

  create(promotion: promotionDTO): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}`, promotion);
  }

  update(promotion: promotionDTO): Observable<number> {
    return this.http.put<number>(`${this.apiUrl}`, promotion);
  } 

  delete(id: number): Observable<number> {
    return this.http.delete<number>(`${this.apiUrl}/${id}`);
  }
}
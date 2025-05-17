import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { SeasonDTO } from '../models/SeasonDTO';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeasonService {
  private readonly apiUrl = `${environment.apiUrl}/Season`;

  private http = inject(HttpClient);

  getAll(): Observable<SeasonDTO[]> {
    return this.http.get<SeasonDTO[]>(`${this.apiUrl}`);
  }

  getById(id: number): Observable<SeasonDTO> {
    return this.http.get<SeasonDTO>(`${this.apiUrl}/${id}`);
  }

  create(season: SeasonDTO): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}`, season);
  }

  updateSeason(season: SeasonDTO): Observable<number> {
    return this.http.put<number>(`${this.apiUrl}`, season);
  } 

  updateSeasonActive(id: number, active: boolean): Observable<number> {
    return this.http.put<number>(`${this.apiUrl}/ChangeIsActive/${id}/${active}`, {});
 }

  delete(id: number): Observable<number> {
    return this.http.delete<number>(`${this.apiUrl}/${id}`);
  }
}
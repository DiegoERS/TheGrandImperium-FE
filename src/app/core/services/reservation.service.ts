import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ReservationDTO } from '../models/ReservationDTO';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private readonly apiUrl = `${environment.apiUrl}/Reservation`;

  private http = inject(HttpClient);

  create (data: ReservationDTO): Observable<number> {
    return this.http.post<number>(this.apiUrl, data);
  }

  getAllReservations(): Observable<ReservationDTO[]> {
    return this.http.get<ReservationDTO[]>(this.apiUrl);
  }
  getReservationById(reservationId: number): Observable<ReservationDTO> {
    return this.http.get<ReservationDTO>(`${this.apiUrl}/${reservationId}`);
  }

  update(data: ReservationDTO): Observable<number> {
    return this.http.put<number>(this.apiUrl, data);
  }

  delete(reservationId: number): Observable<number> {
    return this.http.delete<number>(`${this.apiUrl}/${reservationId}`);
  }

  activateReservation(reservationId: number): Observable<number> {
    return this.http.put<number>(`${this.apiUrl}/activate/${reservationId}`, null);
  }
}

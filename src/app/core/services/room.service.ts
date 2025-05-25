import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoomsDTO } from '../models/RoomsDTO';
import { roomTypeDTO } from '../models/RoomType.DTO';
@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private readonly apiUrl = `${environment.apiUrl}/Room`;
 private http = inject(HttpClient);

  getAllRooms(): Observable<RoomsDTO[]> {
      return this.http.get<RoomsDTO[]>(this.apiUrl);
    }

  getAllRoomsByDate(entryDate:string,departureDate:string,roomTypeId:number): Observable<RoomsDTO[]> {
      return this.http.get<RoomsDTO[]>(`${this.apiUrl}/GetRoomsForReservation/${entryDate}/${departureDate}/${roomTypeId}`);
    }

  getRoomById(roomId: number): Observable<RoomsDTO> {
    return this.http.get<RoomsDTO>(`${this.apiUrl}/GetSomeRoom/${roomId}`);
  }

  create(data: RoomsDTO): Observable<number> {
    return this.http.post<number>(this.apiUrl, data);
  }
  
  update(data: RoomsDTO): Observable<number> {
    return this.http.put<number>(this.apiUrl, data);
  }

  delete(roomId: number): Observable<number> {
    return this.http.delete<number>(`${this.apiUrl}/${roomId}`);
  }

}

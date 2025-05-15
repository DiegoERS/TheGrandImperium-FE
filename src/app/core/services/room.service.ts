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

  
}

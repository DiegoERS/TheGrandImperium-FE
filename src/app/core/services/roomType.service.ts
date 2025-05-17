import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { roomTypeDTO } from '../models/RoomType.DTO';
import { Observable, tap } from 'rxjs';
import e from 'express';

@Injectable({
  providedIn: 'root'
})

export class RoomTypeService {
    private readonly apiUrl = `${environment.apiUrl}/RoomType`;
  private http = inject(HttpClient);

getAll(): Observable<roomTypeDTO[]> {
    return this.http.get<roomTypeDTO[]>(this.apiUrl);
  }

update(RoomType: roomTypeDTO): Observable<number> {
    return this.http.put<number>(`${this.apiUrl}`, RoomType);
  } 

}
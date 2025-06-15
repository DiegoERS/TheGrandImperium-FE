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


  getById(roomTypeId: number): Observable<roomTypeDTO> {
    return this.http.get<roomTypeDTO>(`${this.apiUrl}/${roomTypeId}`);
  }

  // POST - Crear un nuevo room type
  create(roomType: roomTypeDTO): Observable<roomTypeDTO> {
    return this.http.post<roomTypeDTO>(this.apiUrl, roomType);
  }

  // PUT - Actualizar un room type existente
  update(roomType: roomTypeDTO): Observable<number> {
    return this.http.put<number>(this.apiUrl, roomType);
  }

  // DELETE - Eliminar un room type por ID
  delete(roomTypeId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${roomTypeId}`);
  }

}
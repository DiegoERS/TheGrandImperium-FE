import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AdvertisingDTO } from '../models/AdvertisingDTO';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdvertisingService {

  private readonly apiUrl = `${environment.apiUrl}/Advertising`;
  private http=inject(HttpClient);

  getAdvertisings(): Observable<AdvertisingDTO[]> {
    return this.http.get<AdvertisingDTO[]>(this.apiUrl);
  }
  create(data: AdvertisingDTO): Observable<number> {
    return this.http.post<number>(this.apiUrl, data);
  }
  update(data: AdvertisingDTO): Observable<number> {
    return this.http.put<number>(this.apiUrl, data);
  }
  delete(advertisingId: number): Observable<number> {
    return this.http.delete<number>(`${this.apiUrl}/${advertisingId}`);
  }
}

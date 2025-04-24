import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageInformationDTO } from '../models/PageInformationDTO';

@Injectable({
  providedIn: 'root'
})
export class PageInformationService {

  private readonly apiUrl = `${environment.apiUrl}/PageInformation`;
  private http=inject(HttpClient);

  getByPage(page: number): Observable<PageInformationDTO> {
    return this.http.get<PageInformationDTO>(`${this.apiUrl}/${page}`);
  }

  create(data: PageInformationDTO): Observable<number> {
    return this.http.post<number>(this.apiUrl, data);
  }

  update(data: PageInformationDTO): Observable<number> {
    return this.http.put<number>(this.apiUrl, data);
  }

  delete(pageInformationId: number): Observable<number> {
    return this.http.delete<number>(`${this.apiUrl}/${pageInformationId}`);
  }
}

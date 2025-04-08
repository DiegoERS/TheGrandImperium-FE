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
    console.log(`${this.apiUrl}/${page}`);
    return this.http.get<PageInformationDTO>(`${this.apiUrl}/${page}`);
  }

  create(data: PageInformationDTO): Observable<PageInformationDTO> {
    return this.http.post<PageInformationDTO>(this.apiUrl, data);
  }

  update(data: PageInformationDTO): Observable<PageInformationDTO> {
    return this.http.put<PageInformationDTO>(this.apiUrl, data);
  }

  delete(pageInformationId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${pageInformationId}`);
  }
}

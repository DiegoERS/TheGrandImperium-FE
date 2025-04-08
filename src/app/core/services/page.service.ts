import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageDTO } from '../models/PageDTO';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  private readonly apiUrl = `${environment.apiUrl}/Page`;

  private http = inject(HttpClient);
  
  getAllPages(): Observable<PageDTO[]> {
    return this.http.get<PageDTO[]>(this.apiUrl);
  }

  createPage(page: PageDTO): Observable<PageDTO> {
    return this.http.post<PageDTO>(this.apiUrl, page);
  }

  updatePage(page: PageDTO): Observable<PageDTO> {
    return this.http.put<PageDTO>(this.apiUrl, page);
  }

  deletePage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

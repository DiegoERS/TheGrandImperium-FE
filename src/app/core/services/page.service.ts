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

  createPage(page: PageDTO): Observable<number> {
    return this.http.post<number>(this.apiUrl, page);
  }

  updatePage(page: PageDTO): Observable<number> {
    return this.http.put<number>(this.apiUrl, page);
  }

  deletePage(id: number): Observable<number> {
    return this.http.delete<number>(`${this.apiUrl}/${id}`);
  }
}

import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FeatureDTO } from '../models/FeatureDTO';

@Injectable({
  providedIn: 'root'
})
export class FeatureService {

  private readonly apiUrl = `${environment.apiUrl}/Feature`;
  private http=inject(HttpClient);

  getAllFeatures(): Observable<FeatureDTO[]> {
    return this.http.get<FeatureDTO[]>(this.apiUrl);
  }
  // GET /api/Feature/{featureId}
  getFeatureById(featureId: number): Observable<FeatureDTO> {
    return this.http.get<FeatureDTO>(`${this.apiUrl}/${featureId}`);
  }

  // GET /api/Feature/roomtype/{roomTypeId}
  getFeaturesByRoomType(roomTypeId: number): Observable<FeatureDTO[]> {
    return this.http.get<FeatureDTO[]>(`${this.apiUrl}/roomtype/${roomTypeId}`);
  }

  // POST /api/Feature
  addFeature(feature: FeatureDTO): Observable<number> {
    feature.featureId = 0; // Ensure featureId is set to 0 for new features
    return this.http.post<number>(this.apiUrl, feature);
  }

  // PUT /api/Feature
  updateFeature(feature: FeatureDTO): Observable<number> {
    return this.http.put<number>(this.apiUrl, feature);
  }

  // DELETE /api/Feature/{featureId}
  deleteFeature(featureId: number): Observable<number> {
    return this.http.delete<number>(`${this.apiUrl}/${featureId}`);
  }

  // POST /api/Feature/link/{featureId}/{roomTypeId}
  linkFeatureToRoomType(featureId: number, roomTypeId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/link/${featureId}/${roomTypeId}`, {});
  }

  // POST /api/Feature/unlink/{featureId}/{roomTypeId}
  unlinkFeatureFromRoomType(featureId: number, roomTypeId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/unlink/${featureId}/${roomTypeId}`, {});
  }
}

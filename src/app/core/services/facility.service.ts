import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FacilityDTO } from '../models/FacilityDTO';

@Injectable({
  providedIn: 'root'
})
export class FacilityService {

  private readonly apiUrl = `${environment.apiUrl}/Facility`;
  private http=inject(HttpClient);

  getAllFacilities(): Observable<FacilityDTO[]> {
    return this.http.get<FacilityDTO[]>(this.apiUrl);
 }

  // GET /api/Facility/{facilityId}
  getFacilityById(facilityId: number): Observable<FacilityDTO> {
    return this.http.get<FacilityDTO>(`${this.apiUrl}/${facilityId}`);
  }

  // POST /api/Facility
  addFacility(facility: FacilityDTO): Observable<number> {
    facility.facilityId = 0; // Ensure id is set to 0 for new facilities
    return this.http.post<number>(this.apiUrl, facility);
  }
  // PUT /api/Facility
  updateFacility(facility: FacilityDTO): Observable<number> {
    return this.http.put<number>(this.apiUrl, facility);
  }
  // DELETE /api/Facility/{facilityId}
  deleteFacility(facilityId: number): Observable<number> {
    return this.http.delete<number>(`${this.apiUrl}/${facilityId}`);
  }


}

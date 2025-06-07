import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PageInformationService } from '../../core/services/page-information.service';
import { PageInformationDTO } from '../../core/models/PageInformationDTO';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FacilityService } from '../../core/services/facility.service';
import { FacilityDTO } from '../../core/models/FacilityDTO';
import { FeatureService } from '../../core/services/feature.service';


@Component({
  selector: 'app-facilities',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './facilities.component.html',
  styleUrl: './facilities.component.scss'
})
export class FacilitiesComponent implements OnInit {
  facilities: FacilityDTO[] = [];
  loading = true;
  private pageInformationService=inject(PageInformationService);
  private facilityService=inject(FacilityService);
  private FeatureService=inject(FeatureService);
  pageInformation: PageInformationDTO | null = null;
    
      private platformId = inject(PLATFORM_ID);

   private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
    
  ngOnInit(): void {
    if (this.isBrowser()) {
      var page = JSON.parse(localStorage.getItem('selectedPage') || '{}');
    }
    this.pageInformationService.getByPage(page.pageId).subscribe((data: PageInformationDTO) => {
      this.pageInformation = data;
      this.loading = false;
    });
    this.loadFacilities();
  }

  loadFacilities(): void {
    this.facilityService.getAllFacilities().subscribe((data: FacilityDTO[]) => {
      this.facilities = data;
    this.facilities.forEach(facility => {
      this.getFeaturesByFacilityId(facility.facilityId);
    });
      this.loading = false;
    }, error => {
      console.error('Error loading facilities:', error);
      this.loading = false;
    });
  }

  //obtener features por id de facility
  getFeaturesByFacilityId(facilityId: number): void {
    this.FeatureService.getFeaturesByFacility(facilityId).subscribe(features => {
      const facility = this.facilities.find(f => f.facilityId === facilityId);
      if (facility) {
        facility.features = features;
      }
    }, error => {
      console.error('Error loading features for facility:', error);
    });
  }
}
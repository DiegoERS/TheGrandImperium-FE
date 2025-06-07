import {  Component,  AfterViewInit,Inject,inject,PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {  RouterModule, ActivatedRoute, Router } from '@angular/router';
import { PageInformationService } from '../../core/services/page-information.service';
import { PageInformationDTO } from '../../core/models/PageInformationDTO';
@Component({
  standalone: true,
  selector: 'app-how-to-get-to',
  templateUrl: './how-to-get-to.component.html',
  styleUrls: ['./how-to-get-to.component.scss'],
  imports: [CommonModule, MatProgressSpinnerModule,RouterModule]
})
export class HowToGetToComponent implements AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  pageInformation: PageInformationDTO | null = null;
  private pageInformationService = inject(PageInformationService);
  loading = true;

  private route = inject(ActivatedRoute);
  private router  = inject(Router);
  
  async ngAfterViewInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {

      const page = JSON.parse(localStorage.getItem('selectedPage') || '{}');
      this.pageInformationService.getByPage(page.pageId).subscribe((data: PageInformationDTO) => {
      this.pageInformation = data;
      console.log(data);
      this.loading = false;
    });

      const L = await import('leaflet');
      await import('leaflet-routing-machine');

      const destinationLat = 10.296854045618298;
      const destinationLng = -85.83878938212567;

      // Verifica si el navegador soporta geolocalización
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;

            const map = L.map('map').setView([userLat, userLng], 14);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);

            // Marcador en tu ubicación
            const userMarker = L.marker([userLat, userLng]).addTo(map);

            // Marcador en el destino
            const destinationMarker = L.marker([destinationLat, destinationLng]).addTo(map);

            // Ruta desde tu ubicación al destino
           L.Routing.control({
            waypoints: [L.latLng(userLat, userLng), L.latLng(destinationLat, destinationLng)],
            routeWhileDragging: true,
            lineOptions: {
              styles: [{ color: 'black', weight: 6 }],
              extendToWaypoints: false,
              missingRouteTolerance: 0
            },
            show: true
          }).addTo(map);
          this.loading = false;
          },
          (error) => {
            console.error('Error obteniendo tu ubicación:', error);
            alert('No se pudo obtener tu ubicación. Asegúrate de permitir el acceso.');
            this.loading = false;
          }
        );
      } else {
        alert('Tu navegador no soporta geolocalización.');
        this.loading = false;
      }
    }
  }
}
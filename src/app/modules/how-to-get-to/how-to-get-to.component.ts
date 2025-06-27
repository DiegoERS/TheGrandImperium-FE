import {
  Component,
  AfterViewInit,
  Inject,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { PageInformationService } from '../../core/services/page-information.service';
import { PageInformationDTO } from '../../core/models/PageInformationDTO';

@Component({
  standalone: true,
  selector: 'app-how-to-get-to',
  templateUrl: './how-to-get-to.component.html',
  styleUrls: ['./how-to-get-to.component.scss'],
  imports: [CommonModule, MatProgressSpinnerModule, RouterModule],
})
export class HowToGetToComponent implements AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  pageInformation: PageInformationDTO | null = null;
  private pageInformationService = inject(PageInformationService);
  loading = true;

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  async ngAfterViewInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      const page = JSON.parse(sessionStorage.getItem('selectedPage') || '{}');
      this.pageInformationService
        .getByPage(page.pageId)
        .subscribe((data: PageInformationDTO) => {
          this.pageInformation = data;
          console.log(data);
          this.loading = false;
        });

      // Import Leaflet modules
      const [L, routing] = await Promise.all([
        import('leaflet'),
        import('leaflet-routing-machine')
      ]);

      // Get the routing control from the imported module
      const RoutingControl = (routing as any).default || routing;

      const destinationLat = 10.296854045618298;
      const destinationLng = -85.83878938212567;

      // Verifica si el navegador soporta geolocalización
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;

            const mapContainer = document.getElementById('map');
            if (mapContainer && (mapContainer as any)._leaflet_id) {
              (mapContainer as any)._leaflet_id = null;
            }

            const map = L.map('map').setView([userLat, userLng], 14);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; OpenStreetMap contributors',
            }).addTo(map);

            // Marcador en tu ubicación
            const userMarker = L.circleMarker([userLat, userLng], {
              radius: 8,
              color: 'blue',
              fillColor: '#2196f3',
              fillOpacity: 0.8,
            }).addTo(map);

            // Marcador en el destino (como punto/círculo)
            const destinationMarker = L.circleMarker(
              [destinationLat, destinationLng],
              {
                radius: 8,
                color: 'red',
                fillColor: '#f44336',
                fillOpacity: 0.8,
              }
            ).addTo(map);

            // Create routing control using the imported routing module
            const routingControl = RoutingControl.control({
              waypoints: [
                L.latLng(userLat, userLng),
                L.latLng(destinationLat, destinationLng),
              ],
              routeWhileDragging: true,
              lineOptions: {
                styles: [{ color: 'black', weight: 6 }],
                extendToWaypoints: false,
                missingRouteTolerance: 0,
              },
              show: true,
              createMarker: () => null, // eliminar marcadores por defecto
            });

            routingControl.addTo(map);
            this.loading = false;
          },
          (error) => {
            console.error('Error obteniendo tu ubicación:', error);
            alert(
              'No se pudo obtener tu ubicación. Asegúrate de permitir el acceso.'
            );
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
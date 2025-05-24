import { Component, OnInit, Inject,inject, PLATFORM_ID } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PageInformationService } from '../../core/services/page-information.service';
import { PageInformationDTO } from '../../core/models/PageInformationDTO';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Importar leaflet CSS para que los iconos funcionen bien
import 'leaflet/dist/leaflet.css';

@Component({
  selector: 'app-how-to-get-to',
  imports : [CommonModule, RouterModule, MatProgressSpinnerModule],
  templateUrl: './how-to-get-to.component.html',
  styleUrls: ['./how-to-get-to.component.scss']
})
export class HowToGetToComponent implements OnInit {
 
  pageInformation: PageInformationDTO | null = null;
  loading = false;
  private pageInformationService= inject(PageInformationService);

 
  lat: number = 10.30017672890319; // Latitud fija para Wyndham Tamarindo
  lng: number = -85.84483380195266; // Longitud fija para Wyndham Tamarindo
  map: any;
  marker: any;


  private router= inject(Router);
  private platformId = inject(PLATFORM_ID);
  private route= inject(ActivatedRoute);

 

  
  async ngOnInit(): Promise<void> {
  if (isPlatformBrowser(this.platformId)) {
    const page = JSON.parse(localStorage.getItem('selectedPage') || '{}');

    this.pageInformationService.getByPage(page.pageId).subscribe((data: PageInformationDTO) => {
      this.pageInformation = data;
    });

    // Importar leaflet y routing machine
    const L = await import('leaflet');
    await import('leaflet-routing-machine');



    this.initMap(L);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          this.map.setView([userLat, userLng], 13);

          const userMarker = L.marker([userLat, userLng]).addTo(this.map);

          const control = L.Routing.control({
            waypoints: [L.latLng(userLat, userLng), L.latLng(this.lat, this.lng)],
            routeWhileDragging: true,
            lineOptions: {
              styles: [{ color: 'black', weight: 4 }],
              extendToWaypoints: false,
              missingRouteTolerance: 0
            },
            show: true
          }).addTo(this.map);

          control.on('routesfound', (e: any) => {
            const routes = e.routes;
            const summary = routes[0].summary;
            console.log(`Distancia: ${summary.totalDistance} m`);
            console.log(`Duración: ${summary.totalTime} s`);
          });
        },
        (error) => {
          console.error('Error al obtener la ubicación del usuario', error);
        }
      );
    } else {
      console.error('Geolocalización no está soportada por este navegador.');
    }
  }
}

  initMap(L: any) {
    const lat = this.lat ?? 9.9387;
    const lng = this.lng ?? -84.1072;

    this.map = new L.Map('mapReport', {
      zoomControl: true,
      maxZoom: 20,
      minZoom: 2,
      center: L.LatLng(lat, lng),
      zoom: 15,
    });

    this.map.zoomControl.setPosition('bottomright');

    L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&hl=tr&x={x}&y={y}&z={z}', {
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      maxNativeZoom: 20,
      zIndex: 0,
      maxZoom: 20,
    }).addTo(this.map);

    this.marker = L.marker([this.lat, this.lng], { draggable: false }).addTo(this.map);

    setTimeout(() => {
      this.map.invalidateSize();
    }, 300);
  }

  renderMarker(L: any) {
    this.marker.setLatLng(L.LatLng(this.lat, this.lng));
    this.map.panTo( L.LatLng(this.lat, this.lng));
    this.router.navigate([], {
      queryParams: { lat: this.lat, lng: this.lng },
      relativeTo: this.route,
    });
  }
}
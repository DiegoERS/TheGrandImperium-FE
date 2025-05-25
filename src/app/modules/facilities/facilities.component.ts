import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PageInformationService } from '../../core/services/page-information.service';
import { PageInformationDTO } from '../../core/models/PageInformationDTO';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface Facility {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  features: string[];
  schedule?: string;
}

@Component({
  selector: 'app-facilities',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './facilities.component.html',
  styleUrl: './facilities.component.scss'
})
export class FacilitiesComponent implements OnInit {
  facilities: Facility[] = [];
  loading = true;
  private pageInformationService=inject(PageInformationService);
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
      console.log(data);
      this.loading = false;
    });
    // Cargar las facilidades del hotel (en un caso real, esto vendría de un servicio)
    this.facilities = [
      {
        id: 1,
        name: 'Piscina Infinity',
        description: 'Disfrute de nuestra espectacular piscina con vista al océano. Perfecta para relajarse y disfrutar del sol tropical.',
        imageUrl: 'https://www.fluidra.com/wp-content/uploads/2022/04/iStock-641448082_iStock-641448082-1.webp',
        features: [
          'Servicio de toallas',
          'Bar acuático',
          'Sillas y sombrillas',
          'Zona infantil segregada'
        ],
        schedule: 'Abierto todos los días de 7:00 AM a 10:00 PM'
      },
      {
        id: 2,
        name: 'Restaurante El Imperium',
        description: 'Nuestro restaurante principal ofrece una exquisita selección de platillos internacionales y locales en un ambiente elegante.',
        imageUrl: 'https://s.ineventos.com/cr/2020/02/126955/la-33-gastropub-298342-i-360w.jpg',
        features: [
          'Buffet de desayuno',
          'Menú a la carta para almuerzo y cena',
          'Selección de vinos premium',
          'Opciones vegetarianas y veganas'
        ],
        schedule: 'Desayuno: 6:30 AM - 10:30 AM, Almuerzo: 12:00 PM - 3:00 PM, Cena: 6:30 PM - 10:30 PM'
      },
      {
        id: 3,
        name: 'Spa & Wellness Center',
        description: 'Un oasis de tranquilidad donde podrá rejuvenecer cuerpo y mente con nuestros tratamientos exclusivos.',
        imageUrl: 'https://expospa.wordpress.com/wp-content/uploads/2016/11/spa-toulouse-centre.jpg?w=680',
        features: [
          'Masajes terapéuticos',
          'Tratamientos faciales',
          'Sauna y baño turco',
          'Salón de belleza'
        ],
        schedule: 'Abierto todos los días de 9:00 AM a 8:00 PM. Se recomienda reservación previa.'
      },
      {
        id: 4,
        name: 'Gimnasio',
        description: 'Manténgase en forma durante su estadía con nuestro moderno gimnasio equipado con lo último en tecnología fitness.',
        imageUrl: 'https://www.hotelsanbada.com/es/imgs/fitness/fitness_01.jpg',
        features: [
          'Equipo cardiovascular',
          'Área de pesas libres',
          'Clases de yoga y pilates',
          'Entrenador personales disponible'
        ],
        schedule: 'Abierto 24 horas para huéspedes del hotel'
      },
      {
        id: 5,
        name: 'Salones para Eventos',
        description: 'Espacios versátiles para reuniones, conferencias y celebraciones con capacidad desde 10 hasta 200 personas.',
        imageUrl: 'https://mltmemkhoc5e.i.optimole.com/7-_IgtM.jy4g~52f45/w:800/h:541/q:mauto/f:avif/https://dbd.es/wp-content/uploads/2022/02/SALONEVENTOSHOTEL1.jpg',
        features: [
          'Equipamiento audiovisual',
          'Servicio de catering',
          'Internet de alta velocidad',
          'Diferentes configuraciones disponibles'
        ],
        schedule: 'Disponible con reservación previa'
      }
    ];
  }
}
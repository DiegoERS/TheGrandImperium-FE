import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Room {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  features: string[];
  schedule?: string;
}

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.scss'
})
export class RoomsComponent implements OnInit {
  rooms: Room[] = [];
  
  ngOnInit(): void {
    // Cargar las habitaciones del hotel (en un caso real, esto vendría de un servicio)
    this.rooms = [
      {
        id: 1,
        name: 'Suite Presidencial',
        description: 'Nuestra suite más lujosa con vista panorámica al océano, jacuzzi privado y sala de estar exclusiva.',
        imageUrl: 'https://e9c3aa9d33ed68ad5563-53656e37320f5eb0ad9175f5f21a9949.ssl.cf1.rackcdn.com/u/zemi-beach/new-photography/three-bed-presidential_03.jpg',
        features: [
          'Cama King size',
          'Jacuzzi privado',
          'Wi-Fi gratuito',
          'Desayuno incluido'
        ],
        schedule: '$500 por noche'
      },
      {
        id: 2,
        name: 'Habitación Deluxe',
        description: 'Una opción elegante con balcón privado y todas las comodidades para una estancia placentera.',
        imageUrl: 'https://image-tc.galaxy.tf/wijpeg-3m28bp7iv80r6sj6sthfkud0h/mexicali-ejecutiva3_wide.jpg?crop=0%2C99%2C1900%2C1069',
        features: [
          'Cama Queen size',
          'Balcón con vista al jardín',
          'Wi-Fi gratuito',
          'Mini bar'
        ],
        schedule: '$250 por noche'
      },
      {
        id: 3,
        name: 'Habitación Estándar',
        description: 'Confort y funcionalidad en un espacio acogedor ideal para estancias cortas o de negocios.',
        imageUrl: 'https://www.hpanorama.com/es/imagenes/tipologias-de-habitaciones/6/1259/original/standard-room-hotel-venice-lido.jpg',
        features: [
          'Cama doble',
          'TV por cable',
          'Escritorio de trabajo',
          'Aire acondicionado'
        ],
        schedule: '$150 por noche'
      },
      {
        id: 4,
        name: 'Habitación Familiar',
        description: 'Amplia y cómoda, diseñada para familias con niños, con todas las facilidades necesarias.',
        imageUrl: 'https://www.castelohotel.com.mx/movil/img/habitacion_estandar.jpg',
        features: [
          'Dos camas dobles',
          'Sofá cama',
          'Cuna disponible bajo petición',
          'Cafetera y mini nevera'
        ],
        schedule: '$180 por noche'
      },
      {
        id: 5,
        name: 'Penthouse Suite',
        description: 'El alojamiento más exclusivo, con una terraza privada y vistas impresionantes.',
        imageUrl: 'https://images.neobookings.com/1280x853/hotels/ibiza/hotel-torre-del-mar/rooms/penthouse-suite-panoramic-sea-view-with-terrace-and-hydromassage-bathtub-kqxlwre04l.jpeg',
        features: [
          'Cama King size',
          'Terraza privada',
          'Servicio de habitación 24 horas',
          'Bañera de hidromasaje'
        ],
        schedule: '$700 por noche'
      }
    ];
  }
}
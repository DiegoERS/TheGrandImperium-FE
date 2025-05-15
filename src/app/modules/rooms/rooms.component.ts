import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageInformationService } from '../../core/services/page-information.service';
import { RoomService } from '../../core/services/room.service';
import { RoomTypeService } from '../../core/services/roomType.service';
import { roomTypeDTO } from '../../core/models/RoomType.DTO';
import { PageInformationDTO } from '../../core/models/PageInformationDTO';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.scss'
})
export class RoomsComponent implements OnInit {
  rooms: roomTypeDTO[] = [];
  loading = true;
  private pageInformationService = inject(PageInformationService);
  private roomService = inject(RoomService);
  private roomTypeService = inject(RoomTypeService);
  pageInformation: PageInformationDTO | null = null;
  
  ngOnInit(): void {
    var page=JSON.parse(localStorage.getItem('selectedPage')|| '{}');
    this.pageInformationService.getByPage(page.pageId).subscribe((data: PageInformationDTO) => {
      this.pageInformation = data;
      this.loading = false;
    });

     // Cargar las habitaciones desde el servicio en rooms 
    this.roomTypeService.getAll().subscribe((data: roomTypeDTO[]) => {
      this.rooms = data;
      this.loading = false;
    });

    // this.rooms = [
    //   {
    //     id: 1,
    //     name: 'Habitación Estándar',
    //     description: 'Un espacio cómodo y funcional, ideal para estancias cortas o viajes de negocios.',
    //     imageUrl: 'https://www.hpanorama.com/es/imagenes/tipologias-de-habitaciones/6/1259/original/standard-room-hotel-venice-lido.jpg',
    //     features: [
    //       'Cama doble',
    //       "TV por cable",
    //       "Escritorio de trabajo",
    //       "Aire acondicionado"
    //     ],
    //     schedule: "$150 por noche"
    //   },
    //   {
    //     id: 2,
    //     name: "Habitación Junior",
    //     description: "Una opción elegante con balcón privado y todas las comodidades para una estancia placentera.",
    //     imageUrl: "https://image-tc.galaxy.tf/wijpeg-3m28bp7iv80r6sj6sthfkud0h/mexicali-ejecutiva3_wide.jpg?crop=0%2C99%2C1900%2C1069",
    //     features: [
    //       "Cama Queen size",
    //       "Balcón con vista al jardín",
    //       "Wi-Fi gratuito",
    //       "Mini bar"
    //     ],
    //     schedule: "$250 por noche"
    //   },
    //   {
    //     id: 3,
    //     name: "Suite Presidencial",
    //     description: "Nuestra suite más exclusiva con una vista panorámica al océano, jacuzzi privado y sala de estar.",
    //     imageUrl: "https://e9c3aa9d33ed68ad5563-53656e37320f5eb0ad9175f5f21a9949.ssl.cf1.rackcdn.com/u/zemi-beach/new-photography/three-bed-presidential_03.jpg",
    //     features: [
    //       "Cama King size",
    //       "Jacuzzi privado",
    //       "Wi-Fi gratuito",
    //       "Desayuno incluido"
    //     ],
    //     schedule: "$500 por noche"
    //   }
    // ];
  }
}


import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageInformationService } from '../../core/services/page-information.service';
import { PageInformationDTO } from '../../core/models/PageInformationDTO';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { roomTypeDTO } from '../../core/models/RoomType.DTO';
import { RoomTypeService } from '../../core/services/roomType.service';
import { RoomService } from '../../core/services/room.service';

@Component({
  selector: 'app-admin-room',
  imports: [CommonModule, MatProgressSpinnerModule,FormsModule],
  standalone: true,
  templateUrl: './admin-room.component.html',
  styleUrl: './admin-room.component.scss'
})
export class AdminRoomComponent implements OnInit {
  loading = true;
  private pageInformationService = inject(PageInformationService);
  private roomService = inject(RoomService);
  private roomTypeService = inject(RoomTypeService);

  pageInformation: PageInformationDTO | null = null;

  rooms: roomTypeDTO[] = [];
  selectedRoomId: number | null = null; // ID de la habitación seleccionada
  selectedRoom: roomTypeDTO | null = null; // Habitación seleccionada


  ngOnInit(): void {
    // Cargar información de la página
    const page = JSON.parse(localStorage.getItem('selectedPage') || '{}');
    this.pageInformationService.getByPage(page.pageId).subscribe({
      next: (data: PageInformationDTO) => {
        this.pageInformation = data;
        this.checkLoadingState();
      },
      error: (err) => {
        console.error('Error al cargar la información de la página:', err);
        this.checkLoadingState();
      }
    });

    // Cargar tipos de habitaciones
    this.roomTypeService.getAll().subscribe({
      next: (data: roomTypeDTO[]) => {
        this.rooms = data;
        if (this.rooms.length > 0) {
          this.selectedRoomId = this.rooms[0].roomTypeId; // Seleccionar la primera habitación por defecto
          this.onRoomChange();
        }
        this.checkLoadingState();
      },
      error: (err) => {
        console.error('Error al cargar los tipos de habitaciones:', err);
        this.checkLoadingState();
      }
    });
  }

  onRoomChange(): void {
    // Encontrar la habitación seleccionada por ID
    this.selectedRoom = this.rooms.find(room => room.roomTypeId === this.selectedRoomId) || null;
  }

  private checkLoadingState(): void {
    // Verificar si ambas cargas han finalizado
    if (this.pageInformation && this.rooms.length > 0) {
      this.loading = false;
    }
  }
}


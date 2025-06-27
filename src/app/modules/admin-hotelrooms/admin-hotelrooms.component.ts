import { Component, OnInit, inject } from '@angular/core';
import { RoomService } from '../../core/services/room.service';
import { RoomsDTO } from '../../core/models/RoomsDTO';
import { roomTypeDTO } from '../../core/models/RoomType.DTO';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { RoomTypeService } from '../../core/services/roomType.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-hotelrooms',
  templateUrl: './admin-hotelrooms.component.html',
  styleUrls: ['./admin-hotelrooms.component.scss'],
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class AdminHotelRoomsComponent implements OnInit {

  rooms: RoomsDTO[] = [];
  selectedRoom: RoomsDTO | null = null;
  selectedRoomTypeId: number | null = null;
  selectedRoomTypeIdEdit: number | null = null;
  selectedRoomType: roomTypeDTO = {} as roomTypeDTO;
  selectedRoomTypeEdit: roomTypeDTO = {} as roomTypeDTO;
  private roomTypeService = inject(RoomTypeService);
  roomTypes: roomTypeDTO[] = [];
  mostrarFormularioNueva: boolean = false;
    mostrarFormularioEdicion: boolean = false;
  newRoom: RoomsDTO = {
    roomId: 0,
    roomNumber: '',
    isActive: true,
    roomTypeDTO: {
      roomTypeId: 0,
      description: '',
      name: '',
      basePrice: 0,
      features: [],
      roomTypeImageDTO: {
        roomTypeImageId: 0,
        imageDTO: {
          imageId: 0,
          url: ''
        }
      }
    }
  };

  constructor(private roomService: RoomService) {}

  ngOnInit(): void {

    this.roomTypeService.getAll().subscribe({
      next: (data: roomTypeDTO[]) => {
        this.roomTypes = data;
        if (this.roomTypes.length > 0) {
          this.selectedRoomTypeId = this.roomTypes[0].roomTypeId;
          this.onRoomChange();
        }
      }
    });
    this.loadRooms();
  }

  loadRooms(): void {
    this.roomService.getAllRooms().subscribe({
      next: data => this.rooms = data,
      error: err => console.error('Error al obtener habitaciones', err)
    });
  }

  createRoom(): void {
    const roomNumber = this.newRoom.roomNumber;
    const duplicate = this.rooms.find(room => room.roomNumber === roomNumber);

    if (duplicate) {
      Swal.fire({
        title: 'Error',
        text: 'Ya existe una habitación con ese número.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    this.newRoom.roomTypeDTO = this.selectedRoomType;

    this.roomService.create(this.newRoom).subscribe({
      next: () => {
        Swal.fire({
          title: 'Éxito',
          text: 'Habitación creada correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        this.loadRooms();
        this.resetNewRoom();
      },
      error: err => {
        console.error('Error al crear habitación:', err);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo crear la habitación.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  selectRoomForEdit(room: RoomsDTO): void {
    this.selectedRoom = JSON.parse(JSON.stringify(room));
    this.selectedRoomTypeId = this.selectedRoom?.roomTypeDTO.roomTypeId ?? null;
    this.selectedRoomTypeEdit = this.roomTypes.find(room => room.roomTypeId ===  this.selectedRoomTypeId) as roomTypeDTO;
  }

  updateRoom(): void {
  if (!this.selectedRoom) return;

  const roomNumber = this.selectedRoom.roomNumber;
  const duplicate = this.rooms.find(
  room => room.roomNumber === roomNumber && room.roomId !== this.selectedRoom?.roomId

  );

  if (duplicate) {
    Swal.fire({
      title: 'Error',
      text: 'Ya existe una habitación con ese número.',
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
    return;
  }
  console.log('Enviando datos para actualización:', this.selectedRoom);
  this.selectedRoom.roomTypeDTO = this.selectedRoomTypeEdit;
  this.roomService.update(this.selectedRoom).subscribe({
    next: () => {
      Swal.fire({
        title: 'Éxito',
        text: 'Habitación actualizada correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
      this.loadRooms();
      this.selectedRoom = null;
    },
    error: err => {
      console.error('Error al actualizar habitación', err);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo actualizar la habitación.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  });
}


  deleteRoom(id: number): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción eliminará la habitación de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.roomService.delete(id).subscribe({
          next: () => {
            Swal.fire({
              title: 'Eliminado',
              text: 'Habitación eliminada correctamente.',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            });
            this.loadRooms();
          },
          error: err => {
            console.error('Error al eliminar habitación', err);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar la habitación.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        });
      }
    });
  }

  resetNewRoom(): void {
    this.newRoom = {
      roomId: 0,
      roomNumber: '',
      isActive: true,
      roomTypeDTO: {
        roomTypeId: 0,
        description: '',
        name: '',
        basePrice: 0,
        features: [],
        roomTypeImageDTO: {
          roomTypeImageId: 0,
          imageDTO: {
            imageId: 0,
            url: ''
          }
        }
      }
    };
  }

cancelarEdicion() {
  this.mostrarFormularioEdicion = false;
  this.selectedRoom = null;
}

  onRoomChange(): void {
    const id = Number(this.selectedRoomTypeId);
    this.selectedRoomType = this.roomTypes.find(room => room.roomTypeId === id) as roomTypeDTO;
  }
    onRoomChangeEdit(): void {
    const id = Number(this.selectedRoomTypeId);
    this.selectedRoomTypeEdit = this.roomTypes.find(room => room.roomTypeId === id) as roomTypeDTO;
  }

}

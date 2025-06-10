import { Component, OnInit,inject } from '@angular/core';
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
  selectedRoomType: roomTypeDTO = {} as roomTypeDTO;
  private roomTypeService = inject(RoomTypeService);
  roomTypes: roomTypeDTO[] = [];
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
    })
  this.loadRooms();
  }

  loadRooms(): void {
    this.roomService.getAllRooms().subscribe({
      next: data => this.rooms = data,
      error: err => console.error('Error al obtener habitaciones', err)
    });
  }



  createRoom(): void {
    console.log('Datos enviados:', this.newRoom);

    this.newRoom.roomTypeDTO = this.selectedRoomType;
    this.roomService.create(this.newRoom).subscribe({
      next: (id) => {
        console.log('Habitación creada con ID:', id);
        this.loadRooms();
        this.resetNewRoom();
      },
      error: err => {
        console.error('Error al crear habitación:', err);
        alert('Error al crear habitación. Revisa la consola.');
      }
    });
  }

  selectRoomForEdit(room: RoomsDTO): void {
    this.selectedRoom = JSON.parse(JSON.stringify(room));
  }

  updateRoom(): void {
    if (!this.selectedRoom) return;
    const roomNumber = this.selectedRoom.roomNumber;
    const duplicate = this.rooms.find(room => room.roomNumber === roomNumber) as RoomsDTO;
if(duplicate){

  console.error('Error al actualizar habitación numero de habitacion existente');
  return;
}
    this.roomService.update(this.selectedRoom).subscribe({
      next: () => {
        this.loadRooms();
        this.selectedRoom = null;
      },
      error: err => console.error('Error al actualizar habitación', err)
    });
  }

  deleteRoom(id: number): void {
    if (!confirm('¿Desea eliminar esta habitación?')) return;

    this.roomService.delete(id).subscribe({
      next: () => this.loadRooms(),
      error: err => console.error('Error al eliminar habitación', err)
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

  cancelarEdicion(): void {
    this.selectedRoom = null;
  }
    onRoomChange() {
    const id = Number(this.selectedRoomTypeId);
    this.selectedRoomType = this.roomTypes.find(room => room.roomTypeId === id) as roomTypeDTO;
  }

}

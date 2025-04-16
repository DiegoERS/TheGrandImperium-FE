import { Component, inject, OnInit } from '@angular/core';
import { RoomsDTO } from '../../core/models/RoomsDTO';
import { RoomService } from '../../core/services/room.service';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';


@Component({
  selector: 'app-today-hotel',
  imports: [CommonModule],
  templateUrl: './today-hotel.component.html',
  styleUrl: './today-hotel.component.scss'
})

export class TodayHotelComponent implements OnInit {
  
  rooms: RoomsDTO[] = [];
  currentDate: Date = new Date();
  estadosHabitacion: { [key: number]: string } = {};
  
  private roomService = inject(RoomService);

  ngOnInit(): void {
    this.obtenerHabitaciones();
  }

  obtenerHabitaciones(): void {
    this.roomService.getAllRooms().subscribe((data: RoomsDTO[]) => {
      this.rooms = data;
    });
  }
  
}

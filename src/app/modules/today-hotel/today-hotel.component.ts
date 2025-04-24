import { Component, inject, OnInit } from '@angular/core';
import { RoomsDTO } from '../../core/models/RoomsDTO';
import { RoomService } from '../../core/services/room.service';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';


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

  exportarPDF() {
    const doc = new jsPDF();
    const fechaHoy = new Date().toISOString().slice(0, 10); // formato: yyyy-mm-dd
    const titulo = 'Estado del Hotel Hoy';
  
    // Título centrado
    doc.setFontSize(16);
    doc.setTextColor(33, 37, 41); // texto oscuro
    doc.text(titulo, doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
  
    // Datos
    const headers = [['Número de habitación', 'Tipo', 'Estado']];
    const data = this.rooms.map(room => [
      room.roomNumber,
      room.roomTypeDTO.name,
      room.isActive ? 'DISPONIBLE' : 'NO DISPONIBLE'
    ]);
  
    // Tabla con estilos personalizados
    // Usar autoTable directamente
  autoTable(doc, {
    head: headers,
    body: data,
    startY: 25,
    headStyles: {
      fillColor: [227, 175, 75],
      textColor: [255, 255, 255],
      halign: 'center',
      fontStyle: 'bold'
    },
    bodyStyles: {
      halign: 'center'
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    }
  });

  
    // Guardar con fecha en el nombre
    doc.save(`EstadoHotel_${fechaHoy}.pdf`);
  }
}

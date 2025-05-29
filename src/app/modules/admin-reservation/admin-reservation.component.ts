import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../core/services/reservation.service';
import { ReservationDTO } from '../../core/models/ReservationDTO';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-reservation',
  templateUrl: './admin-reservation.component.html',
  styleUrls: ['./admin-reservation.component.scss'],
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

export class AdminReservationComponent implements OnInit {
  displayedColumns: string[] = [
    'cliente',
    'email',
    'numeroHabitacion',
    'tipoHabitacion',
    'precioBase',
    'fechaReserva',
    'entrada',
    'salida',
    'acciones',
  ];
  dataSource = new MatTableDataSource<ReservationDTO>();
  editando: boolean = false;
  reservaActual: ReservationDTO = this.nuevaReserva();

  constructor(
    private reservaService: ReservationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.reservaService.getAllReservations().subscribe({
      next: (data) => (this.dataSource.data = data),
      error: () =>
        this.snackBar.open('Error al cargar reservaciones', 'Cerrar', {
          duration: 3000,
        }),
    });
  }

  guardarReserva(): void {
    const accion = this.editando
      ? this.reservaService.update(this.reservaActual)
      : this.reservaService.create(this.reservaActual);

    accion.subscribe({
      next: () => {
       Swal.fire({
          title: 'Éxito',
          text: this.editando
            ? 'Reservación actualizada correctamente'
            : 'Reservación creada correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });
        this.cargarReservas();
        this.cancelarEdicion();
      },
      error: () =>
       Swal.fire({
          title: 'Error',
          text: this.editando
            ? 'No se pudo actualizar la reservación'
            : 'No se pudo crear la reservación',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        }),
    });
  }

  editarReserva(reserva: ReservationDTO): void {
    this.reservaActual = { ...reserva };
    this.editando = true;
  }

  eliminarReserva(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.reservaService.delete(id).subscribe({
          next: () => {
            Swal.fire(
              'Eliminado',
              'La reservación ha sido eliminada',
              'success'
            );

            this.cargarReservas();
          },
          error: () =>
           Swal.fire({

              title: 'Error',
              text: 'No se pudo eliminar la reservación',
              icon: 'error',
              confirmButtonText: 'Aceptar',
            }),
        });
      }
    });
  }

  activarReserva(id: number): void {
    this.reservaService.activateReservation(id).subscribe({
      next: () => {
        this.snackBar.open('Reservación activada', 'Cerrar', {
          duration: 3000,
        });
        this.cargarReservas();
      },
      error: () =>
        this.snackBar.open('Error al activar', 'Cerrar', { duration: 3000 }),
    });
  }

  cancelarEdicion(): void {
    this.editando = false;
    this.reservaActual = this.nuevaReserva();
  }

  private nuevaReserva(): ReservationDTO {
    return {
      reservationId: 0,
      reservationDate: '',
      startDate: '',
      endDate: '',
      customerDTO: {
        customerId: 0,
        name: '',
        lastName: '',
        email: '',
        creditCard: '',
      },
      roomDTO: {
        roomId: 0,
        roomNumber: '',
        isActive: false,
        roomTypeDTO: {
          roomTypeId: 0,
          description: '',
          name: '',
          basePrice: 0,
          features: [],
          roomTypeImageDTO: {
            roomTypeImageId: 0,
            imageDTO: { imageId: 0, url: '' },
          },
        },
      },
    };
  }
}

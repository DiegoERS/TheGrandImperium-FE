import { Component, inject, OnInit, ViewChild } from '@angular/core';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { roomTypeDTO } from '../../core/models/RoomType.DTO';
import { RoomsDTO } from '../../core/models/RoomsDTO';
import { promotionDTO } from '../../core/models/PromotionDTO';
import { SeasonDTO } from '../../core/models/SeasonDTO';
import { RoomService } from '../../core/services/room.service';
import { RoomTypeService } from '../../core/services/roomType.service';
import { ReservationService } from '../../core/services/reservation.service';
import { promotionService } from '../../core/services/promotion.service';
import { SeasonService } from '../../core/services/season.service';
import { CustomMatPaginatorIntlComponent } from '../../shared/components/custom-mat-paginator-intl/custom-mat-paginator-intl.component';

import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Router } from '@angular/router';
@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule, // Importar adaptador de fecha nativo
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatCardModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntlComponent },
  ],
})
export class ReservationComponent implements OnInit {
  private roomService = inject(RoomService);
  private roomTypeService = inject(RoomTypeService);
  private reservationService = inject(ReservationService);
  private promotionService = inject(promotionService);
  private seasonService = inject(SeasonService);
  private router = inject(Router);

  tiposHabitacion: roomTypeDTO[] = [];
  tipoSeleccionado: number | null = null;
  habitaciones: RoomsDTO[] = [];
  dataSource = new MatTableDataSource<RoomsDTO>([]);
  total = 0;

  promociones: promotionDTO[] = [];
  temporadas: SeasonDTO[] = [];

  fechaEntrada: Date | null = null;
  fechaSalida: Date | null = null;
  minFechaHoy: Date = new Date();
  minFechaSalida: Date = new Date();
  columnas: string[] = [
    'numero',
    'tipo',
    'precioBase',
    'precioConDescuento',
    'seleccionar',
  ];
  habitacionesSeleccionadas: RoomsDTO[] = [];
  cliente = { nombre: '', apellido: '', email: '', tarjeta: '' };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.cargarDatos();
    this.minFechaHoy.setHours(0, 0, 0, 0); // Asegurarse que sea solo la fecha de hoy
    this.minFechaSalida = new Date(this.minFechaHoy);
  }

  cargarDatos() {
    this.roomTypeService
      .getAll()
      .subscribe((data) => (this.tiposHabitacion = data));
    this.promotionService
      .getAll()
      .subscribe((data) => (this.promociones = data));
    this.seasonService.getAll().subscribe((data) => (this.temporadas = data));
  }

  onFechaEntradaChange() {
    if (this.fechaEntrada) {
      this.minFechaSalida = new Date(this.fechaEntrada);
      if (this.fechaSalida && this.fechaSalida < this.fechaEntrada) {
        this.fechaSalida = null; // Reset si fechaSalida inválida
      }
    } else {
      this.minFechaSalida = new Date(this.minFechaHoy);
    }
  }

  calcularPrecioConDescuento(roomType: roomTypeDTO): number {
    let precio = roomType.basePrice;
    let descuento = 0;

    const promo = this.promociones.find((p) => {
      const mismaHabitacion = p.roomTypeDTO.roomTypeId === roomType.roomTypeId;

      const fechaInicioPromo = new Date(p.startDate);
      const fechaFinPromo = new Date(p.endDate);

      if (!this.fechaEntrada || !this.fechaSalida) return false;

      // Validar si cualquier parte del rango de la reserva cae dentro del rango de la promoción
      const entradaDentro =
        this.fechaEntrada >= fechaInicioPromo &&
        this.fechaEntrada <= fechaFinPromo;
      const salidaDentro =
        this.fechaSalida >= fechaInicioPromo &&
        this.fechaSalida <= fechaFinPromo;

      return mismaHabitacion && (entradaDentro || salidaDentro);
    });

    if (promo) descuento += promo.discount;

    // 🔽 MODIFICADO: validar si cae dentro del rango de una temporada activa
  const temporada = this.temporadas.find((t) => {
    if (!t.isActive || !this.fechaEntrada || !this.fechaSalida) return false;

    const start = new Date(t.startDate);
    const end = new Date(t.endDate);

    const entradaDentro = this.fechaEntrada >= start && this.fechaEntrada <= end;
    const salidaDentro = this.fechaSalida >= start && this.fechaSalida <= end;

    return entradaDentro || salidaDentro;
  });

  if (temporada) descuento += temporada.percentageChange; // ✅ aplica si se encuentra en el rango

    return precio * (1 - descuento / 100);
  }

  filtrarHabitaciones() {
    if (!this.fechaEntrada || !this.fechaSalida || !this.tipoSeleccionado) {
      Swal.fire(
        'Fechas requeridas',
        'Debes seleccionar fecha de entrada y salida.',
        'warning'
      );
      return;
    }

    this.roomService
      .getAllRoomsByDate(
        this.fechaEntrada.toDateString(),
        this.fechaSalida.toDateString(),
        this.tipoSeleccionado
      )
      .subscribe((habitaciones: RoomsDTO[]) => {
        this.habitaciones = habitaciones.map((habitacion) => ({
          ...habitacion,
          precioBase: habitacion.roomTypeDTO.basePrice,
          precioConDescuento: this.calcularPrecioConDescuento(
            habitacion.roomTypeDTO
          ),
        }));
        this.dataSource = new MatTableDataSource(this.habitaciones);
        this.dataSource.paginator = this.paginator;
        this.total = this.habitaciones.length;
      });
  }

  formatearTarjeta(): void {
    if (!this.cliente?.tarjeta) return;

    // Elimina todo lo que no sea número
    const soloNumeros = this.cliente.tarjeta.replace(/\D/g, '');

    // Aplica el formato ####-####-####-####
    const partes = [];
    for (let i = 0; i < soloNumeros.length; i += 4) {
      partes.push(soloNumeros.substring(i, i + 4));
    }

    this.cliente.tarjeta = partes.join('-').substring(0, 19);
  }

  esTarjetaValida(tarjeta: string): boolean {
    const regex = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
    return regex.test(tarjeta);
  }

  permitirSoloNumeros(event: KeyboardEvent): void {
    const tecla = event.key;

    // Permitir teclas de navegación y borrado
    if (
      ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'].includes(tecla)
    ) {
      return;
    }

    // Bloquear si no es número
    if (!/^\d$/.test(tecla)) {
      event.preventDefault();
    }
  }

  bloquearPegarLetras(event: ClipboardEvent): void {
    const texto = event.clipboardData?.getData('text') || '';
    if (!/^\d+$/.test(texto.replace(/\D/g, ''))) {
      event.preventDefault();
    }
  }

  toggleSeleccion(habitacion: RoomsDTO, event: MatCheckboxChange): void {
    if (event.checked) {
      if (
        !this.habitacionesSeleccionadas.some(
          (h) => h.roomId === habitacion.roomId
        )
      ) {
        if (this.habitacionesSeleccionadas.length < 3) {
          this.habitacionesSeleccionadas.push(habitacion);
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Límite alcanzado',
            text: 'Solo puedes seleccionar hasta 3 habitaciones.',
            confirmButtonColor: '#3f51b5',
          });
        }
      }
    } else {
      this.habitacionesSeleccionadas = this.habitacionesSeleccionadas.filter(
        (h) => h.roomId !== habitacion.roomId
      );
    }
  }

  isMaxSelected(habitacion: RoomsDTO): boolean {
    return (
      this.habitacionesSeleccionadas.length >= 3 &&
      !this.habitacionesSeleccionadas.includes(habitacion)
    );
  }

  getCantidadNoches(): number {
    if (!this.fechaEntrada || !this.fechaSalida) return 0;

    const diffTime = this.fechaSalida.getTime() - this.fechaEntrada.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  confirmarReserva() {
  if (this.habitacionesSeleccionadas.length === 0) {
    Swal.fire('Selecciona habitaciones', 'Debes seleccionar al menos una habitación para reservar.', 'warning');
    return;
  }

  const cantidadNoches = this.getCantidadNoches();
  if (cantidadNoches <= 0) {
    Swal.fire('Fechas inválidas', 'La fecha de salida debe ser posterior a la fecha de entrada.', 'warning');
    return;
  }

  const resumen = this.habitacionesSeleccionadas.map(h => {
    const precioUnitario = this.calcularPrecioConDescuento(h.roomTypeDTO);
    const total = precioUnitario * cantidadNoches;
    return `<li>${h.roomNumber} - ${h.roomTypeDTO.name} - $${precioUnitario.toFixed(2)} x ${cantidadNoches} noche(s) = <strong>$${total.toFixed(2)}</strong></li>`;
  }).join('');

  const totalGeneral = this.habitacionesSeleccionadas.reduce((acc, h) => {
    const precio = this.calcularPrecioConDescuento(h.roomTypeDTO);
    return acc + precio * cantidadNoches;
  }, 0);

  Swal.fire({
    title: 'Confirmar Reserva',
    html: `
      <p><strong>${this.cliente.nombre} ${this.cliente.apellido}</strong></p>
      <p>Email: ${this.cliente.email}</p>
      <ul>${resumen}</ul>
      <p style="margin-top: 10px;"><strong>Total: $${totalGeneral.toFixed(2)}</strong></p>
      <p>¿Deseas confirmar la reserva?</p>
    `,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, confirmar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#3f51b5'
  }).then(result => {
    if (result.isConfirmed) {
      this.procesarReservas();
    }
  });
}

private procesarReservas() {
  const reservas = this.habitacionesSeleccionadas.map(habitacion => {
    const habitacionLimpia = { ...habitacion } as any;
    delete habitacionLimpia.precioConDescuento;
    delete habitacionLimpia.precioBase;

    return this.reservationService.create({
      reservationId: 0,
      reservationDate: new Date().toISOString(),
      startDate: this.fechaEntrada?.toISOString() || '',
      endDate: this.fechaSalida?.toISOString() || '',
      roomDTO: habitacionLimpia,
      customerDTO: {
        customerId: 0,
        name: this.cliente.nombre,
        lastName: this.cliente.apellido,
        email: this.cliente.email,
        creditCard: this.cliente.tarjeta
      }
    }).toPromise();
  });

  Promise.all(reservas)
    .then(() => {
      Swal.fire('Reservas Confirmadas', 'La reserva ha sido realizada con éxito.', 'success');
      this.resetFormulario();
      this.router.navigate(['/']);
    })
    .catch(error => {
      Swal.fire('Error', 'Ocurrió un error al confirmar las reservas.', 'error');
      console.error(error);
    });
}

private resetFormulario(): void {
  this.fechaEntrada = null;
  this.fechaSalida = null;
  this.tipoSeleccionado = null;
  this.cliente = { nombre: '', apellido: '', email: '', tarjeta: '' };
  this.habitacionesSeleccionadas = [];
  this.habitaciones = [];
  this.dataSource = new MatTableDataSource<RoomsDTO>([]);
  this.total = 0;
}
}

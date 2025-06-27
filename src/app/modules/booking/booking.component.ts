import { Component, inject, ViewChild } from '@angular/core';
import { RoomsDTO } from '../../core/models/RoomsDTO';
import { RoomService } from '../../core/services/room.service';
import { CommonModule } from '@angular/common';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import 'jspdf-autotable';
import { CustomMatPaginatorIntlComponent } from '../../shared/components/custom-mat-paginator-intl/custom-mat-paginator-intl.component';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { RoomTypeService } from '../../core/services/roomType.service';
import { roomTypeDTO } from '../../core/models/RoomType.DTO';

@Component({
  selector: 'app-booking',
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    ReactiveFormsModule,
  ],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntlComponent },
  ],
})
export class BookingComponent {
  rooms: RoomsDTO[] = [];
  private fb = inject(FormBuilder);
  isLoading = false;
  consultForm: FormGroup = this.fb.group({});
  dataSource = new MatTableDataSource<RoomsDTO>([]);
  displayedColumns: string[] = ['roomNumber', 'roomType'];
  private roomService = inject(RoomService);
  roomTypes: roomTypeDTO[] = [];
  private roomTypeService = inject(RoomTypeService);
  minFechaHoy: Date = new Date();
  minFechaSalida: Date = new Date();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.consultForm = this.fb.group({
      entryDate: ['', Validators.required],
      departureDate: ['', Validators.required],
      roomTypeId: ['', Validators.required],
    });
    this.roomTypeService.getAll().subscribe((data: roomTypeDTO[]) => {
      this.roomTypes = data;
    });

  }
   onFechaEntradaChange() {
    if (this.consultForm.get('entryDate')?.value) {
      this.minFechaSalida = new Date(this.consultForm.get('entryDate')?.value);
      this.minFechaSalida.setDate(this.minFechaSalida.getDate() + 1);
      if (this.consultForm.get('departureDate')?.value && this.consultForm.get('departureDate')?.value < this.consultForm.get('entryDate')?.value) {
        this.consultForm.get('departureDate')?.setValue(this.minFechaSalida);
      }
    } else {
      this.minFechaSalida = new Date(this.minFechaHoy);
    }
  }

  onSubmit(): void {
    if (this.consultForm.invalid) return;

    this.isLoading = true; // Inicia el estado de carga
    const { entryDate, departureDate, roomTypeId } = this.consultForm.value;

    this.roomService
      .getAllRoomsByDate(entryDate, departureDate, roomTypeId)
      .subscribe((data: RoomsDTO[]) => {
        this.rooms = data;
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
      });
  }
}

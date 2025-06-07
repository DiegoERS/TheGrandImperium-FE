import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { PageInformationService } from '../../core/services/page-information.service';
import { FacilityService } from '../../core/services/facility.service';
import { CloudinaryService } from '../../core/services/cloudinary.service';
import { PageInformationDTO } from '../../core/models/PageInformationDTO';
import { FacilityDTO } from '../../core/models/FacilityDTO';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CustomMatPaginatorIntlComponent } from '../../shared/components/custom-mat-paginator-intl/custom-mat-paginator-intl.component';

@Component({
  selector: 'app-update-facilities',
  templateUrl: './update-facilities.component.html',
  styleUrls: ['./update-facilities.component.scss'],
  standalone: true,
  imports: [CommonModule,
  FormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatTableModule,
  MatPaginatorModule,
  MatProgressSpinner],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntlComponent}
  ]
})
export class UpdateFacilitiesComponent implements OnInit {
  pageInformation: PageInformationDTO | null = null;
  facilities: FacilityDTO[] = [];
  dataSource = new MatTableDataSource<FacilityDTO>();
  displayedColumns: string[] = ['name', 'description', 'schedule', 'image', 'actions'];

  selectedFacility: FacilityDTO ={
    facilityId: 0,
    name: '',
    description: '',
    imageUrl: '',
    features: [],
    schedule: ''
  };
  selectedFile: File | null = null;

  loading = true;
  saving = false;

  private pageInformationService = inject(PageInformationService);
  private facilityService = inject(FacilityService);
  private cloudinaryService = inject(CloudinaryService);
  private route = inject(ActivatedRoute);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.pageInformationService.getByPage(id).subscribe({
      next: (data) => {
        this.pageInformation = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('Error al cargar la información');
      }
    });

    this.loadFacilities();
  }

  loadFacilities(): void {
    this.facilityService.getAllFacilities().subscribe(data => {
      this.facilities = data;
      this.dataSource = new MatTableDataSource(this.facilities);
      this.dataSource.paginator = this.paginator;
    });
  }

  editFacility(facility: FacilityDTO) {
    this.selectedFacility = { ...facility };
  }

  cancelEdit() {
    this.selectedFacility = {
      facilityId: 0,
      name: '',
      description: '',
      imageUrl: '',
      features: [],
      schedule: ''
    };
    this.selectedFile = null;
  }

  handleFileInput(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async saveFacility() {
    if (!this.selectedFacility) return;
    this.saving = true;

    try {
      if (this.selectedFile) {
        const imageUrl = await this.cloudinaryService.uploadImage(this.selectedFile);
        this.selectedFacility.imageUrl = imageUrl;
      }

      const isNew = !this.selectedFacility.facilityId;

      const observable = isNew
        ? this.facilityService.addFacility(this.selectedFacility)
        : this.facilityService.updateFacility(this.selectedFacility);

      await observable.toPromise();

      Swal.fire('Éxito', isNew ? 'Facilidad agregada correctamente.' : 'Facilidad actualizada correctamente.', 'success');
      this.cancelEdit();
      this.loadFacilities();
    } catch (error) {
      Swal.fire('Error', 'Hubo un problema al guardar la facilidad.', 'error');
    } finally {
      this.saving = false;
    }
  }

  save() {
    if (!this.pageInformation) return;
    this.saving = true;
    this.pageInformation.pageDTO.title = this.pageInformation.subtitle;

    this.pageInformationService.update(this.pageInformation).subscribe({
      next: () => {
        this.pageInformationService.getByPage(this.pageInformation!.pageDTO.pageId).subscribe(data => {
          this.pageInformation = data;
          this.saving = false;

          Swal.fire({
            title: 'Información actualizada',
            text: 'La información se ha guardado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        });
      },
      error: () => {
        this.saving = false;
        Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar la información. Por favor, inténtelo de nuevo más tarde.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  // NUEVO: Eliminar una facilidad
  deleteFacility(facilityId: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la facilidad.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.facilityService.deleteFacility(facilityId).subscribe({
          next: () => {
            this.loadFacilities();
            Swal.fire('Eliminado', 'La facilidad fue eliminada.', 'success');
            if (this.selectedFacility?.facilityId === facilityId) {
              this.cancelEdit();
            }
          },
          error: () => {
            Swal.fire('Error', 'No se pudo eliminar la facilidad.', 'error');
          }
        });
      }
    });
  }

  
  
}

import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AdvertisingService } from '../../core/services/advertising.service';
import { AdvertisingDTO } from '../../core/models/AdvertisingDTO';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-advertising',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './advertising.component.html',
  styleUrl: './advertising.component.scss'
})
export class AdvertisingComponent implements OnInit {
  
  @ViewChild('advertisingForm') advertisingForm!: NgForm;
  
  onSubmit() {
    if (this.isEditing) {
      this.updateAdvertising();
    } else {
      this.saveAdvertising();
    }
  }

  isEditing = false;
  advertisings: AdvertisingDTO[] = [];
  advertising: AdvertisingDTO = this.createEmptyAdvertising();
  loading = true;
  
  private advertisingService = inject(AdvertisingService);

  ngOnInit(): void {
    this.loadAdvertisings();
  }

  private createEmptyAdvertising(): AdvertisingDTO {
    return {
      advertisingId: 0,
      name: '',
      link: '',
      advertisingImageDTO: {
        advertisingImageId: 0,
        imageDTO: {
          imageId: 0,
          url: ''
        }
      }
    };
  }

  loadAdvertisings() {
    this.loading = true;
    this.advertisingService.getAdvertisings().subscribe((data: AdvertisingDTO[]) => {
      this.advertisings = data;
      this.loading = false;
    });
  }

  saveAdvertising() {
    Swal.fire({
      title: 'Enviando...',
      text: 'Por favor espera mientras procesamos tu acción',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
      backdrop: true
    });

    this.advertisingService.create(this.advertising).subscribe((createdId: number) => {
      // Actualizamos el advertising con el ID devuelto y lo agregamos a la lista
      const newAdvertising = { ...this.advertising, advertisingId: createdId };
      this.advertisings.push(newAdvertising);
      this.clearForm();
      
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Publicidad guardada correctamente',
        showConfirmButton: true,
        timer: 2000
      });
    }, (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al guardar la publicidad',
        showConfirmButton: true
      });
    });
  }

  updateAdvertising() {
    Swal.fire({
      title: 'Enviando...',
      text: 'Por favor espera mientras procesamos tu acción',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
      backdrop: true
    });

    this.advertisingService.update(this.advertising).subscribe(() => {
      const index = this.advertisings.findIndex(ad => ad.advertisingId === this.advertising.advertisingId);
      if (index !== -1) {
        this.advertisings[index] = { ...this.advertising };
      }
      
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Publicidad actualizada correctamente',
        showConfirmButton: true,
        timer: 2000
      });
      this.clearForm();
    }, (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al actualizar la publicidad',
        showConfirmButton: true
      });
    });
  }

  deleteAdvertising(ad: AdvertisingDTO) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.advertisingService.delete(ad.advertisingId).subscribe(() => {
          this.advertisings = this.advertisings.filter(advertising => advertising.advertisingId !== ad.advertisingId);
          this.clearForm();
          
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Publicidad eliminada correctamente',
            showConfirmButton: true,
            timer: 2000
          });
        }, (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al eliminar la publicidad',
            showConfirmButton: true
          });
        });
      }
    });
  }

  editAdvertising(ad: AdvertisingDTO) {
    this.advertising = { 
      ...ad,
      advertisingImageDTO: {
        ...ad.advertisingImageDTO,
        imageDTO: {
          ...ad.advertisingImageDTO.imageDTO
        }
      }
    };
    this.isEditing = true;
  }

  clearForm() {
    this.advertising = this.createEmptyAdvertising();
    this.isEditing = false;
    
    // Resetear el estado del formulario para quitar los mensajes de validación
    if (this.advertisingForm) {
      this.advertisingForm.resetForm();
    }
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.style.display = 'none';
    }
  }

  onImageLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.style.display = 'block';
    }
  }
}
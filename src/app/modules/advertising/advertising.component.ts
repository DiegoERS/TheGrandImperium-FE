import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AdvertisingService } from '../../core/services/advertising.service';
import { CloudinaryService } from '../../core/services/cloudinary.service';
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
  selectedFile: File | null = null;
  imagePreviewUrl: string = '';
  
  private advertisingService = inject(AdvertisingService);
  private cloudinaryService = inject(CloudinaryService);

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

  async onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por favor selecciona un archivo de imagen válido'
        });
        return;
      }

      // Validar tamaño (por ejemplo, máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'La imagen no debe superar los 5MB'
        });
        return;
      }

      this.selectedFile = file;
      
      // Crear preview local
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreviewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeSelectedImage() {
    this.selectedFile = null;
    this.imagePreviewUrl = '';
    
    // Limpiar el input file
    const fileInput = document.getElementById('imageInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  async saveAdvertising() {
    try {
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

      // Si hay una imagen seleccionada, subirla primero
      if (this.selectedFile) {
        const imageUrl = await this.cloudinaryService.uploadImage(this.selectedFile);
        this.advertising.advertisingImageDTO.imageDTO.url = imageUrl;
      }

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
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al subir la imagen',
        showConfirmButton: true
      });
    }
  }

  async updateAdvertising() {
    try {
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

      // Si hay una nueva imagen seleccionada, subirla
      if (this.selectedFile) {
        const imageUrl = await this.cloudinaryService.uploadImage(this.selectedFile);
        this.advertising.advertisingImageDTO.imageDTO.url = imageUrl;
      }

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
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al subir la imagen',
        showConfirmButton: true
      });
    }
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
    
    // Si tiene imagen, mostrarla como preview
    if (this.advertising.advertisingImageDTO?.imageDTO?.url) {
      this.imagePreviewUrl = this.advertising.advertisingImageDTO.imageDTO.url;
    }
  }

  clearForm() {
    this.advertising = this.createEmptyAdvertising();
    this.isEditing = false;
    this.selectedFile = null;
    this.imagePreviewUrl = '';
    
    // Limpiar el input file
    const fileInput = document.getElementById('imageInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    
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
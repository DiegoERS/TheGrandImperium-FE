import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdvertisingDTO } from '../../core/models/AdvertisingDTO';
import Swal from 'sweetalert2';
import { AdvertisingService } from '../../core/services/advertising.service';
import { CloudinaryService } from '../../core/services/cloudinary.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-advertisings',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-advertisings.component.html',
  styleUrl: './update-advertisings.component.scss'
})
export class UpdateAdvertisingsComponent implements OnInit {
  
  advertisingForm: FormGroup;
  
  onSubmit() {
    if (this.isEditing) {
      this.updateAdvertising();
    } else {
      this.saveAdvertising();
    }
  }

  isEditing = false;
  advertisings: AdvertisingDTO[] = [];
  loading = true;
  selectedFile: File | null = null;
  imagePreviewUrl: string = '';
  error: string = '';
  
  private advertisingService = inject(AdvertisingService);
  private cloudinaryService = inject(CloudinaryService);
  private formBuilder = inject(FormBuilder);

  constructor() {
    this.advertisingForm = this.formBuilder.group({
      advertisingId: [0],
      name: ['', [Validators.required, Validators.minLength(2)]],
      link: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]]
    });
  }

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
    this.error = '';
    
    this.advertisingService.getAdvertisings().subscribe({
      next: (data: AdvertisingDTO[]) => {
        this.advertisings = data || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading advertisings:', error);
        this.error = 'Error al cargar las publicidades';
        this.loading = false;
        this.advertisings = [];
        
        Swal.fire({
          icon: 'error',
          title: 'Error de conexión',
          text: 'No se pudieron cargar las publicidades. Verifica tu conexión.',
          showConfirmButton: true
        });
      }
    });
  }

  async onImageSelected(event: Event) {
    // const input = event.target as HTMLInputElement;
    // if (input.files && input.files[0]) {
    //   const file = input.files[0];
      
    //   // Validar que sea una imagen
    //   if (!file.type.startsWith('image/')) {
    //     Swal.fire({
    //       icon: 'error',
    //       title: 'Error',
    //       text: 'Por favor selecciona un archivo de imagen válido'
    //     });
    //     return;
    //   }

    //   // Validar tamaño (por ejemplo, máximo 5MB)
    //   if (file.size > 5 * 1024 * 1024) {
    //     Swal.fire({
    //       icon: 'error',
    //       title: 'Error',
    //       text: 'La imagen no debe superar los 5MB'
    //     });
    //     return;
    //   }

    //   this.selectedFile = file;
      
    //   // Crear preview local
    //   const reader = new FileReader();
    //   reader.onload = (e) => {
    //     this.imagePreviewUrl = e.target?.result as string;
    //   };
    //   reader.onerror = () => {
    //     Swal.fire({
    //       icon: 'error',
    //       title: 'Error',
    //       text: 'Error al leer el archivo de imagen'
    //     });
    //   };
    //   reader.readAsDataURL(file);
    // }
  }

  removeSelectedImage() {
    // this.selectedFile = null;
    // this.imagePreviewUrl = '';
    
    // // Limpiar el input file
    // const fileInput = document.getElementById('imageInput') as HTMLInputElement;
    // if (fileInput) {
    //   fileInput.value = '';
    // }
  }

  async saveAdvertising() {
    // if (!this.advertisingForm.valid) {
    //   this.markFormGroupTouched();
    //   Swal.fire({
    //     icon: 'warning',
    //     title: 'Formulario incompleto',
    //     text: 'Por favor completa todos los campos requeridos correctamente'
    //   });
    //   return;
    // }

    // try {
    //   Swal.fire({
    //     title: 'Enviando...',
    //     text: 'Por favor espera mientras procesamos tu acción',
    //     allowOutsideClick: false,
    //     allowEscapeKey: false,
    //     showConfirmButton: false,
    //     willOpen: () => {
    //       Swal.showLoading();
    //     },
    //     backdrop: true
    //   });

    //   const advertising = this.createAdvertisingFromForm();

    //   // Si hay una imagen seleccionada, subirla primero
    //   if (this.selectedFile) {
    //     try {
    //       const imageUrl = await this.cloudinaryService.uploadImage(this.selectedFile);
    //       advertising.advertisingImageDTO.imageDTO.url = imageUrl;
    //     } catch (imageError) {
    //       throw new Error('Error al subir la imagen');
    //     }
    //   }

    //   this.advertisingService.create(advertising).subscribe({
    //     next: (createdId: number) => {
    //       const newAdvertising = { ...advertising, advertisingId: createdId };
    //       this.advertisings.push(newAdvertising);
    //       this.clearForm();
          
    //       Swal.fire({
    //         icon: 'success',
    //         title: 'Éxito',
    //         text: 'Publicidad guardada correctamente',
    //         showConfirmButton: true,
    //         timer: 2000
    //       });
    //     },
    //     error: (error) => {
    //       console.error('Error saving advertising:', error);
    //       Swal.fire({
    //         icon: 'error',
    //         title: 'Error',
    //         text: 'Error al guardar la publicidad. Inténtalo de nuevo.',
    //         showConfirmButton: true
    //       });
    //     }
    //   });
    // } catch (error) {
    //   console.error('Error in saveAdvertising:', error);
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Error',
    //     text: 'Error al procesar la solicitud',
    //     showConfirmButton: true
    //   });
    // }
  }

  async updateAdvertising() {
    // if (!this.advertisingForm.valid) {
    //   this.markFormGroupTouched();
    //   Swal.fire({
    //     icon: 'warning',
    //     title: 'Formulario incompleto',
    //     text: 'Por favor completa todos los campos requeridos correctamente'
    //   });
    //   return;
    // }

    // try {
    //   Swal.fire({
    //     title: 'Enviando...',
    //     text: 'Por favor espera mientras procesamos tu acción',
    //     allowOutsideClick: false,
    //     allowEscapeKey: false,
    //     showConfirmButton: false,
    //     willOpen: () => {
    //       Swal.showLoading();
    //     },
    //     backdrop: true
    //   });

    //   const advertising = this.createAdvertisingFromForm();

    //   // Si hay una nueva imagen seleccionada, subirla
    //   if (this.selectedFile) {
    //     try {
    //       const imageUrl = await this.cloudinaryService.uploadImage(this.selectedFile);
    //       advertising.advertisingImageDTO.imageDTO.url = imageUrl;
    //     } catch (imageError) {
    //       throw new Error('Error al subir la imagen');
    //     }
    //   } else {
    //     // Mantener la imagen existente si no se seleccionó una nueva
    //     const existingAd = this.advertisings.find(ad => ad.advertisingId === advertising.advertisingId);
    //     if (existingAd?.advertisingImageDTO?.imageDTO?.url) {
    //       advertising.advertisingImageDTO.imageDTO.url = existingAd.advertisingImageDTO.imageDTO.url;
    //     }
    //   }

    //   this.advertisingService.update(advertising).subscribe({
    //     next: () => {
    //       const index = this.advertisings.findIndex(ad => ad.advertisingId === advertising.advertisingId);
    //       if (index !== -1) {
    //         this.advertisings[index] = { ...advertising };
    //       }
          
    //       Swal.fire({
    //         icon: 'success',
    //         title: 'Éxito',
    //         text: 'Publicidad actualizada correctamente',
    //         showConfirmButton: true,
    //         timer: 2000
    //       });
    //       this.clearForm();
    //     },
    //     error: (error) => {
    //       console.error('Error updating advertising:', error);
    //       Swal.fire({
    //         icon: 'error',
    //         title: 'Error',
    //         text: 'Error al actualizar la publicidad. Inténtalo de nuevo.',
    //         showConfirmButton: true
    //       });
    //     }
    //   });
    // } catch (error) {
    //   console.error('Error in updateAdvertising:', error);
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Error',
    //     text: 'Error al procesar la solicitud',
    //     showConfirmButton: true
    //   });
    // }
  }

  deleteAdvertising(ad: AdvertisingDTO) {
    // Swal.fire({
    //   title: '¿Estás seguro?',
    //   text: 'No podrás revertir esto',
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonText: 'Sí, eliminar',
    //   cancelButtonText: 'Cancelar'
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     this.advertisingService.delete(ad.advertisingId).subscribe({
    //       next: () => {
    //         this.advertisings = this.advertisings.filter(advertising => advertising.advertisingId !== ad.advertisingId);
    //         this.clearForm();
            
    //         Swal.fire({
    //           icon: 'success',
    //           title: 'Éxito',
    //           text: 'Publicidad eliminada correctamente',
    //           showConfirmButton: true,
    //           timer: 2000
    //         });
    //       },
    //       error: (error) => {
    //         console.error('Error deleting advertising:', error);
    //         Swal.fire({
    //           icon: 'error',
    //           title: 'Error',
    //           text: 'Error al eliminar la publicidad. Inténtalo de nuevo.',
    //           showConfirmButton: true
    //         });
    //       }
    //     });
    //   }
    // });
  }

  editAdvertising(ad: AdvertisingDTO) {
    // this.advertisingForm.patchValue({
    //   advertisingId: ad.advertisingId,
    //   name: ad.name,
    //   link: ad.link
    // });
    
    // this.isEditing = true;
    
    // // Si tiene imagen, mostrarla como preview
    // if (ad.advertisingImageDTO?.imageDTO?.url) {
    //   this.imagePreviewUrl = ad.advertisingImageDTO.imageDTO.url;
    // }
  }

  clearForm() {
    // this.advertisingForm.reset({
    //   advertisingId: 0,
    //   name: '',
    //   link: ''
    // });
    
    // this.isEditing = false;
    // this.selectedFile = null;
    // this.imagePreviewUrl = '';
    // this.error = '';
    
    // // Limpiar el input file
    // const fileInput = document.getElementById('imageInput') as HTMLInputElement;
    // if (fileInput) {
    //   fileInput.value = '';
    // }
  }

  private createAdvertisingFromForm(): AdvertisingDTO {
    const formValue = this.advertisingForm.value;
    return {
      advertisingId: formValue.advertisingId || 0,
      name: formValue.name,
      link: formValue.link,
      advertisingImageDTO: {
        advertisingImageId: 0,
        imageDTO: {
          imageId: 0,
          url: this.imagePreviewUrl || ''
        }
      }
    };
  }

  private markFormGroupTouched() {
    // Object.keys(this.advertisingForm.controls).forEach(key => {
    //   const control = this.advertisingForm.get(key);
    //   control?.markAsTouched();
    // });
  }

  // Getters para facilitar el acceso a los controles en el template
  get name() { return this.advertisingForm.get('name'); }
  get link() { return this.advertisingForm.get('link'); }

  // Métodos para verificar errores específicos
  hasError(fieldName: string, errorType: string): boolean {
    // const field = this.advertisingForm.get(fieldName);
    // return !!(field?.errors?.[errorType] && field?.touched);
    return false; // Placeholder, implement actual logic if needed
  }

  getErrorMessage(fieldName: string): string {
    // const field = this.advertisingForm.get(fieldName);
    // if (field?.errors && field.touched) {
    //   if (field.errors['required']) {
    //     return `${fieldName === 'name' ? 'El nombre' : 'El enlace'} es requerido`;
    //   }
    //   if (field.errors['minlength']) {
    //     return 'El nombre debe tener al menos 2 caracteres';
    //   }
    //   if (field.errors['pattern']) {
    //     return 'El enlace debe ser una URL válida (debe comenzar con http:// o https://)';
    //   }
    // }
    return '';
  }

  onImageError(event: Event) {
    // const img = event.target as HTMLImageElement;
    // if (img) {
    //   img.style.display = 'none';
    //   // Opcional: mostrar un placeholder
    //   const parent = img.parentElement;
    //   if (parent && !parent.querySelector('.image-error')) {
    //     const errorDiv = document.createElement('div');
    //     errorDiv.className = 'image-error';
    //     errorDiv.textContent = 'Error al cargar imagen';
    //     errorDiv.style.cssText = 'padding: 10px; text-align: center; color: #666; font-size: 12px;';
    //     parent.appendChild(errorDiv);
    //   }
    // }
  }

  onImageLoad(event: Event) {
    // const img = event.target as HTMLImageElement;
    // if (img) {
    //   img.style.display = 'block';
    //   // Remover mensaje de error si existe
    //   const parent = img.parentElement;
    //   const errorDiv = parent?.querySelector('.image-error');
    //   if (errorDiv) {
    //     errorDiv.remove();
    //   }
    // }
  }
}
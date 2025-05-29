import { Component, inject, OnInit } from '@angular/core';
import { PageInformationDTO } from '../../core/models/PageInformationDTO';
import { PageInformationService } from '../../core/services/page-information.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms'; // <-- Import necesario
import { CloudinaryService } from '../../core/services/cloudinary.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-about-us',
  imports: [CommonModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatButtonModule,FormsModule],
  templateUrl: './update-about-us.component.html',
  styleUrl: './update-about-us.component.scss'
})
export class UpdateAboutUsComponent implements OnInit {

   pageInformation: PageInformationDTO = {
     pageInformationId: 0,
     subtitle: '',
     description: '',
     pageInformationImageDTOs: [],
     pageDTO: {
        pageId: 3,
        name: '',
        title: '',
      }
   };
  images: string[] = [];
  loading = true;
  private pageInformationService = inject(PageInformationService);
  private cloudinaryService = inject(CloudinaryService);
  

  ngOnInit(): void {

      this.pageInformationService.getByPage(3).subscribe(data => {
        this.pageInformation = data;
        this.images = data.pageInformationImageDTOs.map(i => i.imageDTO.url);
        this.loading = false;
      });
    
  }

  async onImageSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i];

      try {
        // Subir la imagen al servidor
        const response = await this.cloudinaryService.uploadImage(file); // debes devolver un observable desde tu servicio
        const imageUrl = response;

        // Agregar la nueva URL a la lista de imágenes
        this.images.push(imageUrl);

        // Crear nuevo objeto PageInformationImageDTO
        this.pageInformation.pageInformationImageDTOs.push({
          id: 0, // se creará nuevo en backend
          description: '', // puedes agregar una descripción si es necesario
          imageDTO: {
            imageId: 0, // también nuevo
            url: imageUrl
          }
        });
      } catch (error) {
        console.error('Error al subir imagen:', error);
      }
    }
  }
}


removeImage(index: number) {
  const imageUrl = this.images[index];

  // Elimina la URL de la lista de imágenes
  this.images.splice(index, 1);

  // Filtra el DTO correspondiente
  this.pageInformation.pageInformationImageDTOs = this.pageInformation.pageInformationImageDTOs.filter(
    dto => dto.imageDTO.url !== imageUrl
  );
}


  saveChanges() {
    Swal.fire({
      title: "loading",
      text: "Guardando cambios...",
      icon: "info",
      showConfirmButton: false,
      allowOutsideClick: false
    });
    Swal.showLoading();
    
   console.log('Saving changes:', this.pageInformation);
    this.pageInformationService.update(this.pageInformation).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Success',
          text: 'Actualización de pagina con éxito!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar la página. Inténtalo de nuevo más tarde.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }
}

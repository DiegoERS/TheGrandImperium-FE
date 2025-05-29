import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageInformationService } from '../../core/services/page-information.service';
import { PageInformationDTO } from '../../core/models/PageInformationDTO';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { CloudinaryService } from '../../core/services/cloudinary.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-home',
  imports: [CommonModule, FormsModule, MatButtonModule, MatInputModule, MatProgressSpinnerModule, MatCardModule],
  standalone: true,
  templateUrl: './update-home.component.html',
  styleUrl: './update-home.component.scss'
})
export class UpdateHomeComponent implements OnInit {
  pageInformation: PageInformationDTO | null = null;
  loading = true;
  saving = false;

  imagePreview: string | ArrayBuffer | null = null;
   selectedImageFile: File = {} as File;
  isUploading = false;
  uploadedUrls: string[] = [];
  uploadImage: boolean = false;

  private cloudinaryService = inject(CloudinaryService);
  private pageInformationService = inject(PageInformationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.pageInformationService.getByPage(id).subscribe({
      next: (data) => {
        this.pageInformation = data;
        this.loading = false;
        // Si ya hay imagen, puedes mostrarla como preview
       if (this.pageInformation?.pageInformationImageDTOs?.length) {
          this.uploadedUrls = [];
          // Si quieres mostrar la primera imagen como preview
          this.imagePreview = this.uploadedUrls[0] || null;
        }
      },
      error: () => {
        this.loading = false;
        alert('Error al cargar la información');
      }
    });
  }

  onImageUpload(event: Event) {
    this.uploadImage = true; // Marca que se ha seleccionado una nueva imagen
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    this.selectedImageFile = file; // Guarda el File aquí
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
  }

  async save() {
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
      if (this.uploadImage) {
    
    this.isUploading = true;
    try {
      const url = await this.cloudinaryService.uploadImage(this.selectedImageFile);
      if (
        this.pageInformation &&
        this.pageInformation.pageInformationImageDTOs &&
        this.pageInformation.pageInformationImageDTOs.length > 0 &&
        this.pageInformation.pageInformationImageDTOs[0].imageDTO
      ) {
        this.pageInformation.pageInformationImageDTOs[0].imageDTO.url = url;
      }
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      this.isUploading = false;
      return;
    }
    this.isUploading = false;
    this.uploadImage = false; // Reinicia el estado de la imagen seleccionada
  }  
    if (!this.pageInformation) return;
    this.saving = true;
    this.pageInformation.pageDTO.title = this.pageInformation.subtitle;

    this.pageInformationService.update(this.pageInformation).subscribe({
      next: () => {
        this.pageInformationService.getByPage(this.pageInformation!.pageDTO.pageId).subscribe(data => {
          this.pageInformation = data;
          this.saving = false;
          this.imagePreview = null; // Reinicia la vista previa de la imagen
          Swal.fire('Éxito', 'Información actualizada correctamente', 'success');
        });
      },
      error: () => {
        this.saving = false;
        Swal.fire('Error', 'Error al guardar la información', 'error');
      }
    });
  }
}
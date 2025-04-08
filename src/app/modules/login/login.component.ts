import { Component, inject, ViewChild } from '@angular/core';
import { ImageUploaderComponent } from '../../shared/components/image-uploader/image-uploader.component';
import { CloudinaryService } from '../../core/services/cloudinary.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ImageUploaderComponent,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  @ViewChild('uploader') uploaderComponent!: ImageUploaderComponent;
  uploadedUrls: string[] = [];
  isUploading = false;

  private cloudinaryService=inject(CloudinaryService);

  onImagesChanged(images: File[]) {
    console.log('Imágenes seleccionadas:', images);
    // Aquí puedes subirlas al servidor, guardarlas, etc.
  }

  onSave(images: File[]) {
    console.log('Guardar imágenes:', images);

    this.isUploading = true;

    this.cloudinaryService.uploadMultipleImages(images)
      .then(urls => {
        this.uploadedUrls = urls;
        console.log('Imágenes subidas:', urls);

      this.uploaderComponent.reset();
      })
      .catch(error => {
        console.error('Error al subir imágenes:', error);
      })
      .finally(() => {
        this.isUploading = false;
      });
  }
    
}


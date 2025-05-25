import { Component, inject, OnInit, ViewChild, EventEmitter, Output, Input  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { roomTypeDTO } from '../../core/models/RoomType.DTO';
import { RoomTypeService } from '../../core/services/roomType.service';
import { RoomService } from '../../core/services/room.service';
import { ImageUploaderComponent } from '../../shared/components/image-uploader/image-uploader.component';
import { CloudinaryService } from '../../core/services/cloudinary.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-room',
  imports: [CommonModule, MatProgressSpinnerModule, FormsModule],
  standalone: true,
  templateUrl: './admin-room.component.html',
  styleUrl: './admin-room.component.scss'
})
export class AdminRoomComponent implements OnInit {
 
  @Input() isUploading: boolean = false;
  loading = true;
  private roomService = inject(RoomService);
  private roomTypeService = inject(RoomTypeService);
  private cloudinaryService = inject(CloudinaryService);

  rooms: roomTypeDTO[] = [];
  selectedRoomId: number | null = null;
  selectedRoom: roomTypeDTO = {} as roomTypeDTO;
  imagePreview: string | ArrayBuffer | null = null;
  selectedImageFile: File = {} as File;
  uploadImage: boolean = false;

  @ViewChild('uploader') uploaderComponent!: ImageUploaderComponent;
  uploadedUrls: string[] = [];
  canUploadImage: boolean = true; // Controla la visibilidad del uploader

  ngOnInit(): void {
    this.roomTypeService.getAll().subscribe({
      next: (data: roomTypeDTO[]) => {
        this.rooms = data;
        if (this.rooms.length > 0) {
          this.selectedRoomId = this.rooms[0].roomTypeId;
          this.onRoomChange();
        }
        this.loading = false;
      }
    });
  }

  onRoomChange() {
    const id = Number(this.selectedRoomId);
    this.selectedRoom = this.rooms.find(room => room.roomTypeId === id) as roomTypeDTO;
    // Cuando cambias de habitación, puedes permitir subir imagen de nuevo
    this.canUploadImage = true;
    this.uploadedUrls = [];
    this.imagePreview = null; // Reinicia la vista previa de la imagen
  }

  onImagesChanged(images: File[]) {
    // Si hay una imagen seleccionada, ocultar el uploader
    this.canUploadImage = images.length === 0;
  }

  onSave(image: File) {
    this.isUploading = true;
    this.cloudinaryService.uploadImage(image)
      .then(urls => {
        console.log('Imagen subida:', urls);
        this.selectedRoom.roomTypeImageDTO.imageDTO.url = urls;
        this.uploaderComponent.reset();
        this.canUploadImage = false; // Oculta el uploader después de guardar
      })
      .catch(error => {
        console.error('Error al subir imágenes:', error);
      })
      .finally(() => {
        this.isUploading = false;
      });
  }

  removeUploadedImage(index: number) {
    this.uploadedUrls.splice(index, 1);
    // Si ya no hay imágenes guardadas, mostrar el uploader de nuevo
    if (this.uploadedUrls.length === 0) {
      this.canUploadImage = true;
    }
  }

  // ...existing code...

async updateRoomType() {

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
  // Si hay una nueva imagen seleccionada, súbela primero
  if (this.uploadImage) {
    
    this.isUploading = true;
    try {
      const url = await this.cloudinaryService.uploadImage(this.selectedImageFile);
      this.selectedRoom.roomTypeImageDTO.imageDTO.url = url;
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      this.isUploading = false;
      return;
    }
    this.isUploading = false;
    this.uploadImage = false; // Reinicia el estado de la imagen seleccionada
  }
  // Ahora actualiza la habitación en el backend
  this.roomTypeService.update(this.selectedRoom).subscribe(() => {
    const index = this.rooms.findIndex(r => r.roomTypeId === this.selectedRoom.roomTypeId);
    if (index !== -1) {
      this.rooms[index] = { ...this.selectedRoom };
      this.imagePreview = null;
    }
  });
  Swal.fire({
    title: 'Éxito',
    text: 'La habitación se ha actualizado correctamente',
    icon: 'success',
    confirmButtonText: 'Aceptar'
  });
}

// ...existing code...

  onImageUpload(event: Event): void {
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


}
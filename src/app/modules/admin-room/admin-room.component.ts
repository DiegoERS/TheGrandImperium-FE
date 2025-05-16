import { Component, inject, OnInit, ViewChild, EventEmitter, Output, Input  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { roomTypeDTO } from '../../core/models/RoomType.DTO';
import { RoomTypeService } from '../../core/services/roomType.service';
import { RoomService } from '../../core/services/room.service';
import { ImageUploaderComponent } from '../../shared/components/image-uploader/image-uploader.component';
import { CloudinaryService } from '../../core/services/cloudinary.service';

@Component({
  selector: 'app-admin-room',
  imports: [CommonModule, MatProgressSpinnerModule, FormsModule, ImageUploaderComponent],
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
  selectedRoom: roomTypeDTO | null = null;

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
    this.selectedRoom = this.rooms.find(room => room.roomTypeId === id) || null;
    // Cuando cambias de habitación, puedes permitir subir imagen de nuevo
    this.canUploadImage = true;
    this.uploadedUrls = [];
  }

  onImagesChanged(images: File[]) {
    // Si hay una imagen seleccionada, ocultar el uploader
    this.canUploadImage = images.length === 0;
  }

  onSave(images: File[]) {
    this.isUploading = true;
    this.cloudinaryService.uploadMultipleImages(images)
      .then(urls => {
        this.uploadedUrls = urls;
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
}
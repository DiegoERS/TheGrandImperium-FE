import { Component, inject, OnInit, ViewChild, Input } from '@angular/core';
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
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, FormsModule],
  templateUrl: './admin-room.component.html',
  styleUrl: './admin-room.component.scss'
})
export class AdminRoomComponent implements OnInit {
  @Input() isUploading: boolean = false;

  private roomService = inject(RoomService);
  private roomTypeService = inject(RoomTypeService);
  private cloudinaryService = inject(CloudinaryService);

  loading = true;
  rooms: roomTypeDTO[] = [];
  selectedRoomId: number | null = null;
  selectedRoom: roomTypeDTO = {} as roomTypeDTO;
  imagePreview: string | ArrayBuffer | null = null;
  selectedImageFile: File = {} as File;
  uploadImage: boolean = false;
  isCreating: boolean = false;

  @ViewChild('uploader') uploaderComponent!: ImageUploaderComponent;
  uploadedUrls: string[] = [];
  canUploadImage: boolean = true;

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms() {
    this.roomTypeService.getAll().subscribe({
      next: (data: roomTypeDTO[]) => {
        this.rooms = data;
        if (this.rooms.length > 0 && !this.isCreating) {
          this.selectedRoomId = this.rooms[0].roomTypeId;
          this.onRoomChange();
        }
        this.loading = false;
      }
    });
  }

startCreating() {
  this.isCreating = true;
  this.selectedRoom = {
    roomTypeId: 0,
    name: '',
    basePrice: 0,
    description: '',
    features: [
      {
        featureId: 0,
        name: ''
      }
    ],
    roomTypeImageDTO: {
      roomTypeImageId: 0,
      imageDTO: {
        imageId: 0,
        url: ''
      }
    }
  };
  this.imagePreview = null;
  this.uploadedUrls = [];
  this.selectedImageFile = {} as File;
  this.uploadImage = false;
}



  cancelEdit() {
    this.isCreating = false;
    this.selectedRoomId = this.rooms[0]?.roomTypeId || null;
    this.onRoomChange();
  }

  onRoomChange() {
    const id = Number(this.selectedRoomId);
    this.selectedRoom = this.rooms.find(room => room.roomTypeId === id) as roomTypeDTO;
    this.canUploadImage = true;
    this.uploadedUrls = [];
    this.imagePreview = null;
  }

  onImageUpload(event: Event): void {
    this.uploadImage = true;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedImageFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async uploadIfNeeded() {
    if (this.uploadImage) {
      this.isUploading = true;
      try {
        const url = await this.cloudinaryService.uploadImage(this.selectedImageFile);
        this.selectedRoom.roomTypeImageDTO.imageDTO.url = url;
      } catch (error) {
        console.error('Error al subir imagen:', error);
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');
        throw error;
      } finally {
        this.isUploading = false;
        this.uploadImage = false;
      }
    }
  }

  async updateRoomType() {
    Swal.fire({ title: 'Actualizando...', allowOutsideClick: false, showConfirmButton: false, willOpen: () => Swal.showLoading() });
    try {
      await this.uploadIfNeeded();
      this.roomTypeService.update(this.selectedRoom).subscribe(() => {
        const index = this.rooms.findIndex(r => r.roomTypeId === this.selectedRoom.roomTypeId);
        if (index !== -1) this.rooms[index] = { ...this.selectedRoom };
        Swal.fire('Éxito', 'Habitación actualizada correctamente', 'success');
        this.imagePreview = null;
      });
    } catch {}
  }

  async createRoomType() {
    Swal.fire({ title: 'Creando...', allowOutsideClick: false, showConfirmButton: false, willOpen: () => Swal.showLoading() });
    try {
      await this.uploadIfNeeded();
      this.roomTypeService.create(this.selectedRoom).subscribe(() => {
        this.isCreating = false;
        this.loadRooms();
        Swal.fire('Éxito', 'Habitación creada correctamente', 'success');
      });
    } catch {}
  }

  deleteRoomType() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la habitación.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.roomTypeService.delete(this.selectedRoom.roomTypeId).subscribe(() => {
          Swal.fire('Eliminado', 'La habitación ha sido eliminada.', 'success');
          this.loadRooms();
        });
      }
    });
  }
}

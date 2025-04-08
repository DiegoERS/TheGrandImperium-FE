import { Component, EventEmitter, Output  } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-image-uploader',
  imports: [CommonModule],
  templateUrl: './image-uploader.component.html',
  styleUrl: './image-uploader.component.scss'
})
export class ImageUploaderComponent {

  @Output() imagesChange = new EventEmitter<File[]>();
  @Output() save = new EventEmitter<File[]>();
  images: File[] = [];
  imageUrls: string[] = [];

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      this.addFiles(event.dataTransfer.files);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      this.addFiles(target.files);
    }
  }

  addFiles(fileList: FileList) {
    const newFiles = Array.from(fileList).filter(file => file.type.startsWith('image/'));
    
    newFiles.forEach(file => {
      this.images.push(file);
      this.imageUrls.push(URL.createObjectURL(file));
    });

    this.imagesChange.emit(this.images);
  }

  removeImage(index: number) {
    this.images.splice(index, 1);
    URL.revokeObjectURL(this.imageUrls[index]); // Limpia el blob
    this.imageUrls.splice(index, 1);
    this.imagesChange.emit(this.images);
  }

  onSaveImages() {
    this.save.emit(this.images);
  }

  reset() {

    this.imageUrls.forEach(url => URL.revokeObjectURL(url));
    this.images = [];
    this.imageUrls = [];
    this.imagesChange.emit(this.images);
  }

}

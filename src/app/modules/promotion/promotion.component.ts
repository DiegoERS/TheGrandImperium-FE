import { Component,inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { promotionService } from '../../core/services/promotion.service';
import { RoomTypeService } from '../../core/services/roomType.service';
import { roomTypeDTO } from '../../core/models/RoomType.DTO';
import { promotionDTO } from '../../core/models/PromotionDTO';
import { RoomTypeImageDTO } from '../../core/models/RoomTypeImageDTO';
import { ImageDTO } from '../../core/models/ImageDTO';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-promotion',
  imports: [CommonModule, FormsModule],
  templateUrl: './promotion.component.html',
  styleUrl: './promotion.component.scss'
})
export class PromotionComponent implements OnInit {

onSubmit() {
if (this.isEditing) {
  this.updatePromotion();
}else {
  this.savePromotion();
}
}
  today = new Date().toISOString().split('T')[0];
  isEditing = false;

  promotions: promotionDTO[] = [];
  
  imageDTO: ImageDTO = {
    imageId: 0,
    url: ''
  };

  roomTypeImageDTO: RoomTypeImageDTO = {
    roomTypeImageId: 0,
    imageDTO: this.imageDTO
  };

  roomTypeDTO: roomTypeDTO = {
    roomTypeId: 0,
    description: '',
    name: '',
    basePrice: 0,
    features: [],
    roomTypeImageDTO: this.roomTypeImageDTO
  };

  promotion: promotionDTO = {
    promotionId: 0,
    name: '',
    discount: 0,
    startDate: new Date(),
    endDate: new Date(),
    roomTypeDTO : this.roomTypeDTO
  };

  roomTypes: roomTypeDTO[] = [];
  loading = true;
  private promotionService = inject(promotionService);
  private roomTypeService = inject(RoomTypeService);

  ngOnInit(): void {
    this.loadPromotions();
    this.loadRoomTypes();
  }

  loadPromotions() {
    this.loading = true;
    this.promotionService.getAll().subscribe((data: promotionDTO[]) => {
      this.promotions = data;
      this.loading = false;
    });
  }

  loadRoomTypes() {
    this.loading = true;
    this.roomTypeService.getAll().subscribe((data: roomTypeDTO[]) => {
      this.roomTypes = data;
      this.loading = false;
    });
  }
  savePromotion() {
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
    this.promotionService.create(this.promotion).subscribe((createdId: number) => {
      this.promotionService.getById(createdId).subscribe((createdPromotion: promotionDTO) => {
        this.promotions.push(createdPromotion);
        this.clearForm();
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Promoción guardada correctamente',
          showConfirmButton: true,
          timer: 2000
        });
      });
    });
  }
  updatePromotion() {
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
    this.promotionService.update(this.promotion).subscribe(() => {
      const index = this.promotions.findIndex(p => p.promotionId === this.promotion.promotionId);
      if (index !== -1) {
        this.promotions[index] = { ...this.promotion };
      }
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Promoción actualizada correctamente',
        showConfirmButton: true,
        timer: 2000
      });
      this.clearForm();
    });
  }
  
  deletePromotion(promo: promotionDTO) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.promotionService.delete(promo.promotionId).subscribe(() => {
        this.promotions = this.promotions.filter(p => p.promotionId !== promo.promotionId);
        this.clearForm();   
        });
        Swal.fire(
          'Eliminado!',
          'La promoción ha sido eliminada.',
          'success'
        )
      }
    })
   
  }
  // Editar promoción: carga los datos en el formulario
  editPromotion(promo: promotionDTO) {
    this.promotion = {
      ...promo,
      roomTypeDTO: { ...promo.roomTypeDTO }
    };
    this.isEditing = true;
  }

  clearForm() {
    this.promotion = {
      promotionId: 0,
      name: '',
      discount: 0,
      startDate: new Date(),
      endDate: new Date(),
      roomTypeDTO: this.roomTypeDTO
    }
    this.isEditing = false;
  };
}
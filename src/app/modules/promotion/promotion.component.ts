import { Component,inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { promotionService } from '../../core/services/promotion.service';
import { RoomTypeService } from '../../core/services/roomType.service';
import { roomTypeDTO } from '../../core/models/RoomType.DTO';
import { promotionDTO } from '../../core/models/PromotionDTO';
import { RoomTypeImageDTO } from '../../core/models/RoomTypeImageDTO';
import { ImageDTO } from '../../core/models/ImageDTO';
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
    this.promotionService.create(this.promotion).subscribe((createdId: number) => {
      this.promotionService.getById(createdId).subscribe((createdPromotion: promotionDTO) => {
        this.promotions.push(createdPromotion);
        this.clearForm();
      });
    });
  }
  updatePromotion() {
    this.promotionService.update(this.promotion).subscribe(() => {
      const index = this.promotions.findIndex(p => p.promotionId === this.promotion.promotionId);
      if (index !== -1) {
        this.promotions[index] = { ...this.promotion };
      }
      this.clearForm();
    });
  }
  
  deletePromotion(promo: promotionDTO) {
    this.promotionService.delete(promo.promotionId).subscribe(() => {
      this.promotions = this.promotions.filter(p => p.promotionId !== promo.promotionId);
      this.clearForm();   
    });
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
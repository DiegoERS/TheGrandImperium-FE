import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-promotion',
  imports: [CommonModule, FormsModule],
  templateUrl: './promotion.component.html',
  styleUrl: './promotion.component.scss'
})
export class PromotionComponent {
  today = new Date().toISOString().split('T')[0];

  roomTypes = [
    { roomTypeId: 8, name: 'suite presidencial' },
    { roomTypeId: 9, name: 'doble deluxe' },
    // ...otros tipos
  ];

  // Lista de promociones (puedes cargarla desde un servicio)
  promotions = [
    {
      promotionId: 3,
      name: "descuentazooo",
      discount: 10,
      startDate: "2025-04-29",
      endDate: "2025-05-10",
      roomTypeDTO: {
        roomTypeId: 8,
        name: "suite presidencial"
      }
    },
    {
      promotionId: 2,
      name: "descsdada",
      discount: 10,
      startDate: "2025-04-29",
      endDate: "2025-05-10",
      roomTypeDTO: {
        roomTypeId: 8,
        name: "suite presidencial"
      }
    }
    // ...otras promociones
  ];

  // Objeto de promoción para el formulario
  promotion = {
    promotionId: null,
    name: '',
    discount: 0,
    startDate: '',
    endDate: '',
    roomTypeDTO: {
      roomTypeId: null,
      name: ''
    }
  };

  // Editar promoción: carga los datos en el formulario
  editPromotion(promo: any) {
    this.promotion = {
      ...promo,
      roomTypeDTO: { ...promo.roomTypeDTO }
    };
  }

  // Eliminar promoción
  deletePromotion(promo: any) {
    this.promotions = this.promotions.filter(p => p.promotionId !== promo.promotionId);
  }
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-season',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './season.component.html',
  styleUrl: './season.component.scss'
})
export class SeasonComponent {
  isEditing = false;
  // Objeto para el formulario
  season = {
    seasonId: null,
    name: '',
    percentageChange: 0,
    isActive: true
  };

  // Lista de temporadas
  seasons = [
    {
      seasonId: 1,
      name: 'Alta',
      percentageChange: 20,
      isActive: true
    },
    {
      seasonId: 2,
      name: 'Baja',
      percentageChange: -10,
      isActive: false
    }
  ];

  editSeason(s: any) {
  this.season = { ...s };
  this.isEditing = true;
}

cancelEdit() {
  this.season = {
    seasonId: null,
    name: '',
    percentageChange: 0,
    isActive: true
  };
  this.isEditing = false;
}
deleteSeason(s: any) {
    this.seasons = this.seasons.filter(season => season.seasonId !== s.seasonId);
  }
}
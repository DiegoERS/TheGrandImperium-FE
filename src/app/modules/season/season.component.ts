import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SeasonService } from '../../core/services/season.service';
import { SeasonDTO } from '../../core/models/SeasonDTO';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-season',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './season.component.html',
  styleUrl: './season.component.scss'
})
export class SeasonComponent implements OnInit {
  
onSubmit() {
  if (this.isEditing) {
    this.updateSeason();
  } 
}
  isEditing = false;

  seasons: SeasonDTO[] = [];

  season: SeasonDTO = {} as SeasonDTO;

  loading = true;
  today: string = new Date().toISOString().split('T')[0];

  private seasonService = inject(SeasonService);

  ngOnInit(): void {
    this.loadSeasons();
  }

  loadSeasons() {
    this.loading = true;
    this.seasonService.getAll().subscribe((data: SeasonDTO[]) => {
      this.seasons = data.map(s => ({
      ...s,
      startDate: s.startDate?.split('T')[0],
      endDate: s.endDate?.split('T')[0]
    }));
    this.loading = false;
    });
  }

  onStartDateChange() {
  // Si la fecha de fin es menor a la de inicio, la limpiamos
  if (this.season.endDate && this.season.endDate < this.season.startDate) {
    this.season.endDate = '';
  }
}

  updateSeason() {
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
    this.seasonService.updateSeason(this.season).subscribe(() => {
      const index = this.seasons.findIndex(season => season.seasonId === this.season.seasonId);
      if (index !== -1) {
        this.seasons[index] = { ...this.season };
      }
      this.loadSeasons();
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Temporada actualizada correctamente',
        showConfirmButton: true,
        timer: 2000
      });
      this.clearForm();
    });
  }

  deleteSeason(s: SeasonDTO) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
            this.seasonService.delete(s.seasonId).subscribe(() => {
      this.seasons = this.seasons.filter(season => season.seasonId !== s.seasonId);
      this.clearForm();
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Temporada eliminada correctamente',
        showConfirmButton: true,
        timer: 2000
      });
    });

      }
    });

  }

  editSeason(s: SeasonDTO) {
     this.season = {
    ...s,
    startDate: s.startDate?.split('T')[0],
    endDate: s.endDate?.split('T')[0]
  };
    this.isEditing = true;
  }

  clearForm() {
    this.season = {} as SeasonDTO;
    this.isEditing = false;
  }
}
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SeasonService } from '../../core/services/season.service';
import { SeasonDTO } from '../../core/models/SeasonDTO';

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
  } else {
    this.saveSeason();
  }
}
  isEditing = false;

  seasons: SeasonDTO[] = [];

  season: SeasonDTO = {} as SeasonDTO;

  loading = true;
  private seasonService = inject(SeasonService);

  ngOnInit(): void {
    this.loadSeasons();
  }

  loadSeasons() {
    this.loading = true;
    this.seasonService.getAll().subscribe((data: SeasonDTO[]) => {
      this.seasons = data;
      this.loading = false;
    });
  }

saveSeason() {
  this.seasonService.create(this.season).subscribe((createdId: number) => {
    this.seasonService.getById(createdId).subscribe((createdSeason: SeasonDTO) => {
      this.seasons.push(createdSeason);
      this.clearForm();
    });

  });
}

  updateSeason() {
    this.seasonService.updateSeason(this.season).subscribe(() => {
      const index = this.seasons.findIndex(season => season.seasonId === this.season.seasonId);
      if (index !== -1) {
        this.seasons[index] = { ...this.season };
      }
      this.clearForm();
    });
  }

  deleteSeason(s: SeasonDTO) {
    this.seasonService.delete(s.seasonId).subscribe(() => {
      this.seasons = this.seasons.filter(season => season.seasonId !== s.seasonId);
      this.clearForm();
    });
  }

  editSeason(s: SeasonDTO) {
    this.season = { ...s };
    this.isEditing = true;
  }

  clearForm() {
    this.season = {} as SeasonDTO;
    this.isEditing = false;
  }
}
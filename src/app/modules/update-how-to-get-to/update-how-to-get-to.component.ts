import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageInformationService } from '../../core/services/page-information.service';
import { PageInformationDTO } from '../../core/models/PageInformationDTO';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';4
import { MatCardModule } from '@angular/material/card';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-how-to-get-to',
  templateUrl: './update-how-to-get-to.component.html',
  styleUrls: ['./update-how-to-get-to.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatInputModule, MatProgressSpinnerModule,MatCardModule]
})
export class UpdateHowToGetToComponent implements OnInit {
  pageInformation: PageInformationDTO | null = null;
  loading = true;
  saving = false;

  private pageInformationService = inject(PageInformationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.pageInformationService.getByPage(id).subscribe({
      next: (data) => {
        this.pageInformation = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('Error al cargar la información');
      }
    });
  }

save() {
  if (!this.pageInformation) return;
  this.saving = true;
  this.pageInformation.pageDTO.title =this.pageInformation.subtitle;

  this.pageInformationService.update(this.pageInformation).subscribe({
    next: () => {
      this.pageInformationService.getByPage(this.pageInformation!.pageDTO.pageId).subscribe(data => {
        this.pageInformation = data;
        this.saving = false;
  
        Swal.fire({
          title: 'Información actualizada',
          text: 'La información se ha guardado correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        })
      });
    },
    error: () => {
      this.saving = false;
      Swal.fire({
        title: 'Error',
        text: 'No se pudo actualizar la información. Por favor, inténtelo de nuevo más tarde.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  });
}

}

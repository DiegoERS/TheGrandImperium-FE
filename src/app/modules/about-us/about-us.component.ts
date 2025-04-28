import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PageInformationService } from '../../core/services/page-information.service';
import { PageInformationDTO } from '../../core/models/PageInformationDTO';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-about-us',
  imports: [ CommonModule,RouterModule, MatProgressSpinnerModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent implements OnInit {

  pageInformation: PageInformationDTO | null = null;
  selectedImage: string | null = "";
  images: string[] = [];
  loading: boolean = true;
  private pageInformationService= inject(PageInformationService);


  ngOnInit(): void {
    var page=JSON.parse(localStorage.getItem('selectedPage')|| '{}');
    this.pageInformationService.getByPage(page.pageId).subscribe((data: PageInformationDTO) => {
      this.pageInformation = data;

       this.images = data.pageInformationImageDTOs.map(imgDTO => imgDTO.imageDTO.url);
       this.selectedImage = this.images.length > 0 ? this.images[0] : null;
       this.loading = false; // <--- ¡Carga terminada!
    });
  }

  selectImage(img: string) {
    this.selectedImage = img;
  }
}

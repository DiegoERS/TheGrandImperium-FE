import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
  private platformId = inject(PLATFORM_ID);

   private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
  ngOnInit(): void {
    if (this.isBrowser()) {
     var page=JSON.parse(localStorage.getItem('selectedPage')|| '{}');
    }

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

import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PageInformationService } from '../../core/services/page-information.service';
import { PageInformationDTO } from '../../core/models/PageInformationDTO';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-contact-us',
  imports: [CommonModule, RouterModule, MatProgressSpinnerModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent implements OnInit {

  pageInformation: PageInformationDTO | null = null;
  descriptions: string[] = [];
  loading = true;
  private pageInformationService = inject(PageInformationService);

    private platformId = inject(PLATFORM_ID);

   private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser()) {
      var page = JSON.parse(localStorage.getItem('selectedPage') || '{}');
    }
    this.pageInformationService.getByPage(page.pageId).subscribe((data: PageInformationDTO) => {
      this.pageInformation = data;
      this.descriptions = data.description.split('^').map(item => item.trim());
      for (let i = 0; i < this.descriptions.length; i++) {
        if (this.descriptions[i].includes('&#64')) {
          this.descriptions[i] = this.descriptions[i].replace('&#64;', '@');
        }
      }
      this.loading = false; // <--- ¡Carga terminada!
    });
  }

  getIcon(item: string): string {
    if (item.includes('Hotel')) {
      return 'fa-hotel';
    } else if (item.includes('Tel')) {
      return 'fa-phone';
    } else if (item.includes('@')) {
      return 'fa-envelope';
    } else if (item.includes('Apdo Postal')) {
      return 'fa-map-marker-alt';
    }
    return 'fa-info-circle';
  }

}

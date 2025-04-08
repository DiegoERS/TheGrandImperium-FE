import { Component,inject,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageInformationService } from '../../core/services/page-information.service';
import { PageInformationDTO } from '../../core/models/PageInformationDTO';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private pageId: number = 1;
  private pageInformationService=inject(PageInformationService);
  pageInformation: PageInformationDTO | null = null;
  images: string[] = [];
  selectedImage: string | null = "";

  ngOnInit(): void {
    this.pageInformationService.getByPage(this.pageId).subscribe((data: PageInformationDTO) => {
      this.pageInformation = data;
      this.images = data.pageInformationImageDTOs.map(imgDTO => imgDTO.imageDTO.url);
       this.selectedImage = this.images.length > 0 ? this.images[0] : null;
    });
  }
}

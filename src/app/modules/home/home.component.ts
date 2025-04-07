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


  ngOnInit(): void {
    this.pageInformationService.getByPage(this.pageId).subscribe((data: PageInformationDTO) => {
      this.pageInformation = data;
      console.log(data);
    });
  }
  images: string[] = [
    'https://r-charts.com/es/miscelanea/procesamiento-imagenes-magick_files/figure-html/importar-imagen-r.png',
  ];

  selectedImage: string = this.images[0];

  selectImage(img: string): void {
    this.selectedImage = img;
  }
}

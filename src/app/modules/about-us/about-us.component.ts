import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-about-us',
  imports: [RouterModule, CommonModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent {
  images = [
    'https://www.hotelsanbada.com/es/imgs/fitness/fitness_01.jpg',
    'https://mltmemkhoc5e.i.optimole.com/7-_IgtM.jy4g~52f45/w:800/h:541/q:mauto/f:avif/https://dbd.es/wp-content/uploads/2022/02/SALONEVENTOSHOTEL1.jpg',
    'https://expospa.wordpress.com/wp-content/uploads/2016/11/spa-toulouse-centre.jpg?w=680',
    'https://s.ineventos.com/cr/2020/02/126955/la-33-gastropub-298342-i-360w.jpg',
    'https://www.fluidra.com/wp-content/uploads/2022/04/iStock-641448082_iStock-641448082-1.webp'
    ];
  selectedImage = this.images[0];
  selectImage(img: string) {
    this.selectedImage = img;
  }
}

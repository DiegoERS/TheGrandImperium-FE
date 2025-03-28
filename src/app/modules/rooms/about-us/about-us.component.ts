import { Component } from '@angular/core';
import { AdvertisingComponent } from "../../../shared/components/advertising/advertising.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about-us',
  imports: [AdvertisingComponent, RouterModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent {

}

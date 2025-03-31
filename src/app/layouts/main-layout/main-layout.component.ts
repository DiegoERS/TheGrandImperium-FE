import { Component } from '@angular/core';
import { UserNavbarComponent } from "../../shared/components/user-navbar/user-navbar.component";
import { FooterComponent } from "../../shared/components/footer/footer.component";
import { RouterModule } from '@angular/router';
import { AdvertisingComponent } from "../../shared/components/advertising/advertising.component";

@Component({
  selector: 'app-main-layout',
  imports: [UserNavbarComponent, FooterComponent, RouterModule, AdvertisingComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  
}

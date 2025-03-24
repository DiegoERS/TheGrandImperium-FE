import { Component, inject } from '@angular/core';
import { UserNavbarComponent } from "../../shared/components/user-navbar/user-navbar.component";
import { FooterComponent } from "../../shared/components/footer/footer.component";
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [UserNavbarComponent, FooterComponent, RouterModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
 route= inject(ActivatedRoute);
  ngOnInit() {
    this.route.url.subscribe(url => console.log("Ruta actual:", url));
  }
}

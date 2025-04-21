import { Component } from '@angular/core';
import { AdminNavbarComponent } from "../../shared/components/admin-navbar/admin-navbar.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  imports: [AdminNavbarComponent, RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {

}

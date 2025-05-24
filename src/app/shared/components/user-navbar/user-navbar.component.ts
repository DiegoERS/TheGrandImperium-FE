import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router,RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PageDTO } from '../../../core/models/PageDTO';
import { PageService } from '../../../core/services/page.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-user-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './user-navbar.component.html',
  styleUrl: './user-navbar.component.scss'
})
export class UserNavbarComponent implements OnInit {
  private pageService = inject(PageService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);

  isMenuOpen = false;
  pages: PageDTO[] =[];
  activePageName: string |null = null;

    private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.pageService.getAllPages().subscribe(pages => {
      this.pages = pages;
      if (this.isBrowser()) {
        this.activePageName = localStorage.getItem('activePageName');
      }
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  selectPage(page: PageDTO) {
    if (this.isBrowser()) {
      localStorage.setItem('selectedPage', JSON.stringify(page));
      localStorage.setItem('activePageName', page.name);
    }
    this.activePageName = page.name;
    this.closeMenu();
    this.router.navigate(['/', page.name]);
  }

  deletePageName() {
    if (this.isBrowser()) {
      localStorage.removeItem('activePageName');
    }
    this.activePageName = null;
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

}

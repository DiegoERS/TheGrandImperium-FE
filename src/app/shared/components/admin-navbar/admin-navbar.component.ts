import { Component, inject, OnInit, HostListener, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PageDTO } from '../../../core/models/PageDTO';
import { PageService } from '../../../core/services/page.service';

@Component({
  selector: 'app-admin-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-navbar.component.html',
  styleUrl: './admin-navbar.component.scss',
})
export class AdminNavbarComponent implements OnInit {
  private pageService = inject(PageService);
  private router = inject(Router);

  isMenuOpen = false;
  pages: PageDTO[] = [];
  activePageName: string | null = null;
  private touchStartX = 0;

    private platformId = inject(PLATFORM_ID);

   private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  userName: string = ''; // 👈 Agregado

  ngOnInit(): void {
    this.pageService.getAllPages().subscribe((pages) => {
      this.pages = pages;
      if (this.isBrowser()) {
        this.activePageName = localStorage.getItem('activePageName');
      }
      
    });

    this.userName = this.getUserName(); // 👈 Agregado
  }

  isModificarOpen: boolean = false;

toggleModificarSubmenu() {
  this.isModificarOpen = !this.isModificarOpen;
}
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  selectPage(page: PageDTO) {
    localStorage.setItem('selectedPage', JSON.stringify(page));
    localStorage.setItem('activePageName', page.name);
    this.activePageName = page.name;
    this.closeMenu();
    this.router.navigate(['/', page.name]);
  }

  deletePageName() {
    localStorage.removeItem('activePageName');
    this.activePageName = null;
  }

  logout(): void {
    if (this.isAuthenticated()) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      this.router.navigate(['/login']);
    } else {
      alert('No hay un usuario logeado');
    }
  }

  isAuthenticated(): boolean {
    if (this.isBrowser()) {
    return !!localStorage.getItem('user');
    }
    return false;
  }

  getUserName(): string { // 👈 Agregado
    var user;
    if (this.isBrowser()) {
       user = localStorage.getItem('user');
      console.log(user);
    }
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        return parsedUser.name || parsedUser.userName || 'Usuario'; // Ajusta según tu modelo
      } catch (error) {
        console.error('Error parsing user from localStorage', error);
        return 'Usuario';
      }
    }
    return 'Usuario';
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    const touchEndX = event.changedTouches[0].clientX;
    const swipeDistance = touchEndX - this.touchStartX;

    // Abrir el menú si se desliza desde el borde izquierdo
    if (this.touchStartX < 50 && swipeDistance > 50) {
      this.isMenuOpen = true;
    }

    // Cerrar el menú si se desliza hacia la izquierda
    if (this.touchStartX > 200 && swipeDistance < -50) {
      this.isMenuOpen = false;
    }
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { Router,RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PageDTO } from '../../../core/models/PageDTO';
import { PageService } from '../../../core/services/page.service';

@Component({
  selector: 'app-user-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './user-navbar.component.html',
  styleUrl: './user-navbar.component.scss'
})
export class UserNavbarComponent implements OnInit {
  private pageService = inject(PageService);
  private router = inject(Router);

  isMenuOpen = false;
  pages: PageDTO[] =[];
  activePageName: string |null = null;

  ngOnInit(): void {
    this.pageService.getAllPages().subscribe(pages => {
      this.pages = pages;
      this.activePageName = localStorage.getItem('activePageName');
    });
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

}

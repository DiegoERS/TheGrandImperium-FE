import { Component,inject } from '@angular/core';
import {RouterModule} from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-footer',
  imports: [RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  private router= inject(Router);
  logout(): void {
   if(localStorage.getItem("user")){
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }else{
    alert("No hay un usuario logeado")
  }

  }


}

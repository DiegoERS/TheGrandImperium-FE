import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { UserDTO } from '../../core/models/UserDTO';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [CommonModule,ReactiveFormsModule,MatProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {


  private fb= inject(FormBuilder);
  private authService= inject(AuthService);
  private router= inject(Router);
  private platformId = inject(PLATFORM_ID);
   loginForm: FormGroup = this.fb.group({});
  hidePassword = true;
  isLoading = false; // Variable para controlar el estado de carga

   private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }


  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    if(this.authService.isAuthenticated()) {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
  
    this.isLoading = true; // Inicia el estado de carga
    const { email, password } = this.loginForm.value;
  
    const user: UserDTO = {
      userName:"",
      email: email,
      password:password,
      refreshToken:"",
      token:"",
    };

    this.authService.login(user).subscribe({
      next: (userData: UserDTO | undefined) => {
        
        if (!userData) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Usuario o contraseña incorrectos.',
            confirmButtonText: 'Aceptar'
          });
          this.isLoading = false; // Termina el estado de carga
          return;
        }
    
        if (this.isBrowser()) {
        localStorage.setItem('token', userData.token);
        localStorage.setItem('refreshToken', userData.refreshToken);
        localStorage.setItem('user', JSON.stringify(userData));
        }
        this.router.navigate(['/admin/dashboard']).then(() => {
          this.isLoading = false; // Termina el estado de carga
        });


      }
      
    });
  }
}


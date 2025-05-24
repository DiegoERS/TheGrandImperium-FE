import { Component, inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { ImageUploaderComponent } from '../../shared/components/image-uploader/image-uploader.component';
import { CloudinaryService } from '../../core/services/cloudinary.service';
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
  imports: [ImageUploaderComponent,CommonModule,ReactiveFormsModule,MatProgressSpinnerModule],
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
    Swal.fire({
      title: 'Cargando...',
      text: 'Por favor, espera un momento.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

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
    
        Swal.close(); // Cierra el modal de carga
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Inicio de sesión exitoso.',
          confirmButtonText: 'Aceptar'
        });
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


















  //TODO LO RELACIONADO CON EL DRAG AND DROP DE IMAGENES
  @ViewChild('uploader') uploaderComponent!: ImageUploaderComponent;
  uploadedUrls: string[] = [];
  isUploading = false;

  private cloudinaryService=inject(CloudinaryService);

  onImagesChanged(images: File[]) {
    console.log('Imágenes seleccionadas:', images);
    // Aquí puedes subirlas al servidor, guardarlas, etc.
  }

  onSave(images: File[]) {
    console.log('Guardar imágenes:', images);

    this.isUploading = true;

    this.cloudinaryService.uploadMultipleImages(images)
      .then(urls => {
        this.uploadedUrls = urls;
        console.log('Imágenes subidas:', urls);

      this.uploaderComponent.reset();
      })
      .catch(error => {
        console.error('Error al subir imágenes:', error);
      })
      .finally(() => {
        this.isUploading = false;
      });
  }
    
}


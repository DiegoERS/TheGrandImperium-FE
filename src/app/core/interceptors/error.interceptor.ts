import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { catchError, Observable, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notificationService = inject(NotificationService);


  return next(req).pipe(
    catchError((error: HttpErrorResponse): Observable<never> => {
      let errorMessage = 'Ocurrió un error inesperado';

 if (error.status === 0) {
        // Error de red o el servidor no responde
        errorMessage = 'No se puede conectar con el servidor. Verifica tu conexión.';
      } else {
        // Error del lado del servidor
        switch (error.status) {
          case 400:
            errorMessage = 'Solicitud incorrecta (400)';
            break;
          case 401:
            errorMessage = 'No autorizado (401). Redirigiendo al login...';
            router.navigate(['/login']);
            break;
          case 403:
            errorMessage = 'Acceso prohibido (403)';
            break;
          case 404:
            errorMessage = 'Recurso no encontrado (404)';
            break;
          case 500:
            errorMessage = 'Error interno del servidor (500)';
            break;
          default:
            errorMessage = `Error inesperado: ${error.status}`;
        }
      }

      // Mostrar la notificación
      notificationService.showError(errorMessage);

      return throwError(() => new Error(errorMessage));
    })
  );
};

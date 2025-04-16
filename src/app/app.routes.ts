import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { NgModule } from '@angular/core';
import { authGuard } from './core/guards/auth.guard';

//ROUTES
import { AboutUsComponent } from './modules/about-us/about-us.component';
import { HomeComponent } from './modules/home/home.component';
import { RoomsComponent } from './modules/rooms/rooms.component';
import { FacilitiesComponent } from './modules/facilities/facilities.component';
import { ContactUsComponent } from './modules/contact-us/contact-us.component';
import { HowToGetToComponent } from './modules/how-to-get-to/how-to-get-to.component';
import { LoginComponent } from './modules/login/login.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';


export const routes: Routes = [{
    path: '',
    component: MainLayoutComponent,
    children: [
      {path: '', component: HomeComponent },
      {path: 'rooms', component: RoomsComponent},
      {path: 'facilities', component: FacilitiesComponent },
      {path: 'about-us', component: AboutUsComponent},
      {path: 'login', component: LoginComponent},
      {path: 'contact-us', component: ContactUsComponent},
      {path: 'how-to-get-to', component: HowToGetToComponent}
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {path: 'dashboard', component: DashboardComponent, canActivate:[authGuard]}, // Aquí puedes agregar la lógica de autenticación si es necesario
    ]
  },
  { path: '**', redirectTo: '' } // Redirección en caso de ruta no encontrada];
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}

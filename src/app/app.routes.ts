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
import { TodayHotelComponent } from './modules/today-hotel/today-hotel.component';
import { BookingComponent } from './modules/booking/booking.component';
import { AdminRoomComponent } from './modules/admin-room/admin-room.component';
import { SeasonComponent } from './modules/season/season.component';
import { PromotionComponent } from './modules/promotion/promotion.component';

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
      {path: 'how-to-get-to', component: HowToGetToComponent},
      
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {path: 'dashboard', component: DashboardComponent, canActivate:[authGuard]}, // Aquí puedes agregar la lógica de autenticación si es necesario
      { path: 'booking', component: BookingComponent, canActivate:[authGuard] },
      {path: 'today-hotel', component: TodayHotelComponent, canActivate:[authGuard] },
      {path: 'admin-room', component: AdminRoomComponent, canActivate:[authGuard] },
      {path: 'season', component: SeasonComponent, canActivate:[authGuard] },
      {path: 'promotion', component: PromotionComponent, canActivate:[authGuard] }
    ]
  },
  { path: '**', redirectTo: '' } // Redirección en caso de ruta no encontrada];
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}

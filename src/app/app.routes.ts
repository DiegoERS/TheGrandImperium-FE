import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { NgModule } from '@angular/core';

//ROUTES
import { AboutUsComponent } from './modules/about-us/about-us.component';
import { HomeComponent } from './modules/home/home.component';
import { RoomsComponent } from './modules/rooms/rooms.component';
import { FacilitiesComponent } from './modules/facilities/facilities.component';

export const routes: Routes = [{
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      {path: 'rooms', component: RoomsComponent},
      { path: 'facilities', component: FacilitiesComponent },
      {path: 'about-us', component: AboutUsComponent}
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
    ]
  },
  { path: '**', redirectTo: '' } // Redirección en caso de ruta no encontrada];
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}

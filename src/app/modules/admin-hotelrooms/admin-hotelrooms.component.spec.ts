import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHotelRoomsComponent } from './admin-hotelrooms.component';

describe('AdminHotelroomsComponent', () => {
  let component: AdminHotelRoomsComponent;
  let fixture: ComponentFixture<AdminHotelRoomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminHotelRoomsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminHotelRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

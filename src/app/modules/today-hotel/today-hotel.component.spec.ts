import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayHotelComponent } from './today-hotel.component';

describe('TodayHotelComponent', () => {
  let component: TodayHotelComponent;
  let fixture: ComponentFixture<TodayHotelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodayHotelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodayHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

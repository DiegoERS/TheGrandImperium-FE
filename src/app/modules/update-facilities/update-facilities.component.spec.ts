import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFacilitiesComponent } from './update-facilities.component';

describe('UpdateFacilitiesComponent', () => {
  let component: UpdateFacilitiesComponent;
  let fixture: ComponentFixture<UpdateFacilitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateFacilitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateFacilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

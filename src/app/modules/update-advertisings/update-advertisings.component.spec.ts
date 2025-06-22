import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAdvertisingsComponent } from './update-advertisings.component';

describe('UpdateAdvertisingsComponent', () => {
  let component: UpdateAdvertisingsComponent;
  let fixture: ComponentFixture<UpdateAdvertisingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateAdvertisingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateAdvertisingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

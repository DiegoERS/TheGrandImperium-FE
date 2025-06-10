import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFeaturesComponent } from './update-features.component';

describe('UpdateFeaturesComponent', () => {
  let component: UpdateFeaturesComponent;
  let fixture: ComponentFixture<UpdateFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateFeaturesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

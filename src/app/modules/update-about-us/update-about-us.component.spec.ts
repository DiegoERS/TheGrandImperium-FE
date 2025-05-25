import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAboutUsComponent } from './update-about-us.component';

describe('UpdateAboutUsComponent', () => {
  let component: UpdateAboutUsComponent;
  let fixture: ComponentFixture<UpdateAboutUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateAboutUsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateAboutUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateHowToGetToComponent } from './update-how-to-get-to.component';

describe('UpdateHowToGetToComponent', () => {
  let component: UpdateHowToGetToComponent;
  let fixture: ComponentFixture<UpdateHowToGetToComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateHowToGetToComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateHowToGetToComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

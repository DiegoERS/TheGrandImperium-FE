import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowToGetToComponent } from './how-to-get-to.component';

describe('HowToGetToComponent', () => {
  let component: HowToGetToComponent;
  let fixture: ComponentFixture<HowToGetToComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HowToGetToComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HowToGetToComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

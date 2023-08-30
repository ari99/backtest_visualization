import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllGridsComponent } from './all-grids.component';

describe('AllGridsComponent', () => {
  let component: AllGridsComponent;
  let fixture: ComponentFixture<AllGridsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllGridsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllGridsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

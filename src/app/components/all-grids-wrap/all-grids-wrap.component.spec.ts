import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllGridsWrapComponent } from './all-grids-wrap.component';

describe('AllGridsWrapComponent', () => {
  let component: AllGridsWrapComponent;
  let fixture: ComponentFixture<AllGridsWrapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllGridsWrapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllGridsWrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScalarGridComponent } from './scalar-grid.component';

describe('ScalarGridComponent', () => {
  let component: ScalarGridComponent;
  let fixture: ComponentFixture<ScalarGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScalarGridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScalarGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

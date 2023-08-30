import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombinedGridsComponent } from './combined-grids.component';

describe('CombinedGridsComponent', () => {
  let component: CombinedGridsComponent;
  let fixture: ComponentFixture<CombinedGridsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CombinedGridsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CombinedGridsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

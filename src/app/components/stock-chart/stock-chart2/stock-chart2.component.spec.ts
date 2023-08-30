import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockChart2Component } from './stock-chart2.component';

describe('StockChart2Component', () => {
  let component: StockChart2Component;
  let fixture: ComponentFixture<StockChart2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockChart2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockChart2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllStockChartsComponent } from './all-stock-charts.component';

describe('AllStockChartsComponent', () => {
  let component: AllStockChartsComponent;
  let fixture: ComponentFixture<AllStockChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllStockChartsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllStockChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

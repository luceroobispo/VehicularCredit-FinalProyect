import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicularCreditComponent } from './vehicular-credit.component';

describe('VehicularCreditComponent', () => {
  let component: VehicularCreditComponent;
  let fixture: ComponentFixture<VehicularCreditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VehicularCreditComponent]
    });
    fixture = TestBed.createComponent(VehicularCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

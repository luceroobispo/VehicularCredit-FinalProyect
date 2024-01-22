import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationBankComponent } from './configuration-bank.component';

describe('ConfigurationBankComponent', () => {
  let component: ConfigurationBankComponent;
  let fixture: ComponentFixture<ConfigurationBankComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfigurationBankComponent]
    });
    fixture = TestBed.createComponent(ConfigurationBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

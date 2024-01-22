import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedPlansComponent } from './saved-plans.component';

describe('SavedPlansComponent', () => {
  let component: SavedPlansComponent;
  let fixture: ComponentFixture<SavedPlansComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SavedPlansComponent]
    });
    fixture = TestBed.createComponent(SavedPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

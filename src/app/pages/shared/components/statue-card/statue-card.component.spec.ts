import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatueCardComponent } from './statue-card.component';

describe('StatueCardComponent', () => {
  let component: StatueCardComponent;
  let fixture: ComponentFixture<StatueCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatueCardComponent]
    });
    fixture = TestBed.createComponent(StatueCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

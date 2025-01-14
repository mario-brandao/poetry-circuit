import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeGlbComponent } from './three-glb.component';

describe('ThreeGlbComponent', () => {
  let component: ThreeGlbComponent;
  let fixture: ComponentFixture<ThreeGlbComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThreeGlbComponent]
    });
    fixture = TestBed.createComponent(ThreeGlbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

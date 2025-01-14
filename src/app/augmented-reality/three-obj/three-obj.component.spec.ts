import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeObjComponent } from './three-obj.component';

describe('ThreeObjComponent', () => {
  let component: ThreeObjComponent;
  let fixture: ComponentFixture<ThreeObjComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThreeObjComponent]
    });
    fixture = TestBed.createComponent(ThreeObjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

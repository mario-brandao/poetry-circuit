import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeCubeComponent } from './three-cube.component';

describe('ThreeCubeComponent', () => {
  let component: ThreeCubeComponent;
  let fixture: ComponentFixture<ThreeCubeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThreeCubeComponent]
    });
    fixture = TestBed.createComponent(ThreeCubeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

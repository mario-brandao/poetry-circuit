import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeAnimationAndTextureComponent } from './three-animation-and-texture.component';

describe('ThreeAnimationAndTextureComponent', () => {
  let component: ThreeAnimationAndTextureComponent;
  let fixture: ComponentFixture<ThreeAnimationAndTextureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThreeAnimationAndTextureComponent]
    });
    fixture = TestBed.createComponent(ThreeAnimationAndTextureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

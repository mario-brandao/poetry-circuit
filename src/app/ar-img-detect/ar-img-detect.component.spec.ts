import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArImgDetectComponent } from './ar-img-detect.component';

describe('ArImgDetectComponent', () => {
  let component: ArImgDetectComponent;
  let fixture: ComponentFixture<ArImgDetectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArImgDetectComponent]
    });
    fixture = TestBed.createComponent(ArImgDetectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

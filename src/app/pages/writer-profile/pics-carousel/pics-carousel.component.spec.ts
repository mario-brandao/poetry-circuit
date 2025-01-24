import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PicsCarouselComponent } from './pics-carousel.component';

describe('PicsCarouselComponent', () => {
  let component: PicsCarouselComponent;
  let fixture: ComponentFixture<PicsCarouselComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PicsCarouselComponent]
    });
    fixture = TestBed.createComponent(PicsCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

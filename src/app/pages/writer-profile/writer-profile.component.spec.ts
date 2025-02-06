import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WriterProfileComponent } from './writer-profile.component';

describe('PoetProfileComponent', () => {
  let component: WriterProfileComponent;
  let fixture: ComponentFixture<WriterProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WriterProfileComponent],
    });
    fixture = TestBed.createComponent(WriterProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

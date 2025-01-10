import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WritterProfileComponent } from './writter-profile.component';

describe('PoetProfileComponent', () => {
  let component: WritterProfileComponent;
  let fixture: ComponentFixture<WritterProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WritterProfileComponent],
    });
    fixture = TestBed.createComponent(WritterProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

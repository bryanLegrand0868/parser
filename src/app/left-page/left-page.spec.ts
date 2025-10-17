import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftPage } from './left-page';

describe('LeftPage', () => {
  let component: LeftPage;
  let fixture: ComponentFixture<LeftPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeftPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeftPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtiusComponent } from './utius.component';

describe('UtiusComponent', () => {
  let component: UtiusComponent;
  let fixture: ComponentFixture<UtiusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtiusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtiusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

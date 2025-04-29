import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaisPostadosComponent } from './mais-postados.component';

describe('MaisPostadosComponent', () => {
  let component: MaisPostadosComponent;
  let fixture: ComponentFixture<MaisPostadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaisPostadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaisPostadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpcoesCategoriaComponent } from './opcoes-categoria.component';

describe('OpcoesCategoriaComponent', () => {
  let component: OpcoesCategoriaComponent;
  let fixture: ComponentFixture<OpcoesCategoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpcoesCategoriaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpcoesCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

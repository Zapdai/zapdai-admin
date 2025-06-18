import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeZapdaiComponent } from './homeZapdai.component';

describe('CategoriasComponent', () => {
  let component: HomeZapdaiComponent;
  let fixture: ComponentFixture<HomeZapdaiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeZapdaiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeZapdaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

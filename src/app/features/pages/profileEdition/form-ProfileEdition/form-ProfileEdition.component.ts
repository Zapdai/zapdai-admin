import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';



@Component({
  selector: 'app-form-ProfileEdition',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './form-ProfileEdition.component.html',
  styleUrls: ['./form-ProfileEdition.component.scss'],

})
export class FormProfileEditionComponent {
  emailUser: any
  usuarioId: any

  @ViewChild('primeiroInput') primeiroInput!: ElementRef;


  constructor(){}

  ngAfterViewInit(): void {
    this.focarPrimeiroCampo();
  }
  
  focarPrimeiroCampo() {
    if (this.primeiroInput && this.primeiroInput.nativeElement) {
      this.primeiroInput.nativeElement.focus();
    }
  }

  focarProximoCampo(proximoCampo: string) {
    const proximo = document.querySelector(`[formControlName="${proximoCampo}"]`) as HTMLElement;
    if (proximo) {
      proximo.focus();
    }
  }



}

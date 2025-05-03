import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-form-signup',
  imports:[CommonModule,ReactiveFormsModule,MatSnackBarModule],
  templateUrl: './form-signup.component.html',
  styleUrl: './form-signup.component.scss'
})
export class FormSignupComponent {
  @ViewChild('slide1') elemento1!: ElementRef
  @ViewChild('slide2') elemento2!: ElementRef


  ativo = false;
  oculta = true;

  btnProximo(){
    this.elemento1.nativeElement.style.display = 'none';
    this.elemento2.nativeElement.style.display = 'block';
  
  }

  btnVoltar(){
    this.elemento1.nativeElement.style.display = 'block';
    this.elemento2.nativeElement.style.display = 'none';
  }

}

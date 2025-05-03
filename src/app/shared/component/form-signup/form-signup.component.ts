import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-form-signup',
  imports:[CommonModule,ReactiveFormsModule,MatSnackBarModule],
  templateUrl: './form-signup.component.html',
  styleUrl: './form-signup.component.scss'
})
export class FormSignupComponent {
  @ViewChild('slide', { static: true }) elemento!: ElementRef
  @ViewChild('slide2') elemento2!: ElementRef


  ativo = false;
  oculta = true;

  btnProximo(){
  
    this.elemento.nativeElement.classList.add("first")

  }

  btnVoltar(){
   
  }
  
  }


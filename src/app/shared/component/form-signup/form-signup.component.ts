import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { formModalComponent } from '../formModel/formModal.component';
import { loginFormService } from '../../../services/loginService/loginForm.servide';

@Component({
  selector: 'app-form-signup',
  imports:[CommonModule,ReactiveFormsModule,MatSnackBarModule, formModalComponent],
  templateUrl: './form-signup.component.html',
  styleUrl: './form-signup.component.scss'
})
export class FormSignupComponent {
  @ViewChild('slide', { static: true }) elemento!: ElementRef
  @ViewChild('slide1', { static: true }) elemento1!: ElementRef
  @ViewChild('slide2', { static: true }) elemento2!: ElementRef
  constructor(public form:loginFormService){}


  btnProximo(){
    this.elemento.nativeElement.classList.add("first")  
    this.elemento1.nativeElement.style.display = "none";
    this.elemento2.nativeElement.style.display = "block";
  }

  btnVoltar(){
    this.elemento.nativeElement.classList.remove("first")    
    this.elemento1.nativeElement.style.display = "block"; 
    this.elemento2.nativeElement.style.display = "none";
  }

  select<T> (nome:string){
    const data = this.form.groupform.get(nome);
   
    if(!data) {
      throw new Error('Nome inválido!!!')
  }
  return data as FormControl
  }

  data(){
    const data = {
      name:this.select("name").value,
      phoneNumer: this.select("telefone").value,
      cpf: this.select("cpf").value,
      dataNascimento: this.select("datNascimento").value,
      sexo: this.select("sexo").value,
      email: this.select("email").value,
      password: this.select("password").value,
      endereco:{}

    }
    return data
  }
  cadastro(){
   console.log("Minhas datas "+this.data())
  }
  
  }


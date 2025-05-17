import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { formModalComponent } from '../formModel/formModal.component';
import { MatButtonModule } from '@angular/material/button'; 
import { registroForm } from '../../../services/singNupForm/registroForm.servide';
import { cadastro } from '../../core/types/cadastro';
import { SnackService } from '../../../services/snackBar/snack.service';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-form-signup',
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule, formModalComponent, MatButtonModule, NgxMaskDirective],
  templateUrl: './form-signup.component.html',
  styleUrl: './form-signup.component.scss'
})
export class FormSignupComponent {
  @Output() registroBtn = new EventEmitter()
  @ViewChild('slide', { static: true }) elemento!: ElementRef
  @ViewChild('slide1', { static: true }) elemento1!: ElementRef
  @ViewChild('slide2', { static: true }) elemento2!: ElementRef

  ///elemento dos inputs para pular de um para o outro apos apertar enter
  @ViewChild("form1", { static: true }) form1?: ElementRef
  @ViewChild("form2", { static: true }) form2?: ElementRef
  @ViewChild("form3", { static: true }) form3?: ElementRef

  @ViewChild("formSlide2_1", { static: true }) formSlide2_1?: ElementRef
  @ViewChild("formSlide2_2", { static: true }) formSlide2_2?: ElementRef
  @ViewChild("formSlide2_3", { static: true }) formSlide2_3?: ElementRef


  constructor(public form: registroForm, private snak: SnackService) { }

  enterSlide2(event: any) {
    if (event) {
      event.focus()
    }
  }
  btnProximo() {
    this.elemento.nativeElement.classList.add("first")
    this.elemento1.nativeElement.style.display = "none";
    this.elemento2.nativeElement.style.display = "block";
  }

  btnVoltar() {
    this.elemento.nativeElement.classList.remove("first")
    this.elemento.nativeElement.classList.add("show")
    this.elemento1.nativeElement.style.display = "block";
    this.elemento2.nativeElement.style.display = "none";
  }
  save() {
    if (this.isRequiredToRegistre()) {
      this.cadastro()

    } else {
      this.snak.openSnackBar("Preencha todos os campos!")
    }
  }
  MudaProximo() {
    if (this.isRequiredNext()) {
      this.btnProximo()

    } else {
      this.snak.openSnackBar("Preencha todos os campos!")
    }
  }
  isRequiredNext() {
    const nameValid = this.form.groupform.get('name')?.valid;
    const telefoneValid = this.form.groupform.get('telefone')?.valid;
    const emailValid = this.form.groupform.get('email')?.valid
    return !!(nameValid && telefoneValid && emailValid);

  }
  isRequiredToRegistre() {
    const sexoValid = this.form.groupform.get('sexo')?.valid;
    const dataNascimentoValid = this.form.groupform.get('dataNascimento')?.valid;
    const cpfValid = this.form.groupform.get('cpf')?.valid
    const passwordValid = this.form.groupform.get('password')?.valid;
    const connfimeValid = this.form.groupform.get('repeteSenha')?.valid;
    return !!(sexoValid && dataNascimentoValid && cpfValid && passwordValid && connfimeValid);

  }

  mudarCampo(event: any) {
    if (event) {
      event.focus()
    }
  }
  select<T>(nome: string) {
    const data = this.form.groupform.get(nome);

    if (!data) {
      throw new Error('Nome inválido!!!')
    }
    return data as FormControl
  }

  data(): cadastro {
    const data: cadastro = {
      nome: this.select("name").value,
      phoneNumer: this.select("telefone").value,
      cpf: this.select("cpf").value,
      dataNascimento: this.select("dataNascimento").value,
      sexo: this.select("sexo").value,
      email: this.select("email").value,
      password: this.select("password").value,
      endereco: {}

    }
    return data
  }
    cadastro(){
      const password = this.select("password").value;
      const repetepassword = this.select("repeteSenha").value;
      if (password === repetepassword) {
        this.registroBtn.emit(this.data())
      } else {
        this.snak.openSnackBar("Senhas não conferem")
      }
    }

}


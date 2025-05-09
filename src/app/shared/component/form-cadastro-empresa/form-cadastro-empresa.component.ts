import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { cadastro } from '../../core/types/cadastro';
import { SnackService } from '../../../services/snackBar/snack.service';

@Component({
  selector: 'app-form-cadastro-empresa',
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule, MatButtonModule],
  templateUrl: './form-cadastro-empresa.component.html',
  styleUrl: './form-cadastro-empresa.component.scss'
})
export class FormCadastroEmpresaComponent {
  @Output() registroBtn = new EventEmitter()
  @ViewChild('slide', { static: true }) elemento!: ElementRef
  @ViewChild('slide1', { static: true }) elemento1!: ElementRef
  @ViewChild('slide2', { static: true }) elemento2!: ElementRef
  @ViewChild('slide3', { static: true }) elemento3!: ElementRef

  ///elemento dos inputs para pular de um para o outro apos apertar enter
  @ViewChild("form1", { static: true }) form1?: ElementRef
  @ViewChild("form2", { static: true }) form2?: ElementRef
  @ViewChild("form3", { static: true }) form3?: ElementRef

  @ViewChild("formSlide2_1", { static: true }) formSlide2_1?: ElementRef
  @ViewChild("formSlide2_2", { static: true }) formSlide2_2?: ElementRef
  @ViewChild("formSlide2_3", { static: true }) formSlide2_3?: ElementRef


  constructor(private snak: SnackService) { }

  evitaSubmit(event: Event) {
    event.preventDefault(); // impede envio do form
  }

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
  MudaProximo() {
      this.btnProximo()
  }

  mudarCampo(event: any) {
    if (event) {
      event.focus()
    }
  }
}



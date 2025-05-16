import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { cadastroEmpresaForm } from '../../../services/cadastroEmpresa/cadastroEmpresa.servide';



@Component({
  selector: 'app-form-cadastro-empresa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './form-cadastro-empresa.component.html',
  styleUrls: ['./form-cadastro-empresa.component.scss']
})


export class FormCadastroEmpresaComponent {
  currentStep = 1;

  constructor(public form: cadastroEmpresaForm, private cd: ChangeDetectorRef) { }

  next() {
      this.currentStep++;
      this.cd.detectChanges();  // força atualizar a view
  }

  prev() {
    if (this.currentStep > 1) this.currentStep--;
  }

}


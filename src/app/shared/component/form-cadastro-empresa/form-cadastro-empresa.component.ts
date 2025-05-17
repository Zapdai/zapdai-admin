import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { cadastroEmpresaForm } from '../../../services/cadastroEmpresa/cadastroEmpresa.servide';

type EmpresaFormControls = keyof cadastroEmpresaForm['empresaform']['controls'];

@Component({
  selector: 'app-form-cadastro-empresa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './form-cadastro-empresa.component.html',
  styleUrls: ['./form-cadastro-empresa.component.scss']
})
export class FormCadastroEmpresaComponent {
  currentStep = 1;

  constructor(
    public form: cadastroEmpresaForm,
    private cd: ChangeDetectorRef
  ) {}

  stepFields: Record<number, EmpresaFormControls[]> = {
    1: ['nomeCompania', 'numeroDeTelefone', 'email'],
    2: ['estado_sigla', 'cidade', 'bairro', 'rua', 'numeroEndereco'],
    3: ['cpfResposavel', 'razaoSocial', 'cnpj']
  };


  isRequired(nome: string) {
    return this.form.empresaform.get(nome)?.errors?.["required"] && this.form.empresaform.get(nome)?.touched;
  }

  markCurrentStepTouched() {
    const fields = this.stepFields[this.currentStep];
    fields.forEach(field => {
      this.form.empresaform.controls[field].markAsTouched();
    });
  }

  isCurrentStepValid(): boolean {
    const fields = this.stepFields[this.currentStep];
    return fields.every(field => this.form.empresaform.controls[field].valid);
  }

  next() {
    if (this.isCurrentStepValid()) {
      this.currentStep++;
      this.cd.detectChanges();
    } else {
      this.markCurrentStepTouched();
    }
  }

  prev() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
}

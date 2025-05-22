import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { cadastroEmpresaForm } from '../../../services/cadastroEmpresa/cadastroEmpresa.servide';
import { cepApiBrasilService } from '../../../services/cepApiBrasil/cep.service';
import { NgxMaskDirective } from 'ngx-mask';
import { registroEmpresaApi } from '../../../services/cadastroEmpresa/registroEmpresaApi.service';
import { loadingService } from '../../../services/loading/loading.service';
import { Router } from '@angular/router';

type EmpresaFormControls = keyof cadastroEmpresaForm['empresaform']['controls'];

@Component({
  selector: 'app-form-cadastro-empresa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, NgxMaskDirective],
  templateUrl: './form-cadastro-empresa.component.html',
  styleUrls: ['./form-cadastro-empresa.component.scss']
})
export class FormCadastroEmpresaComponent implements OnInit {
  currentStep = 1;

  constructor(
    public form: cadastroEmpresaForm,
    private cd: ChangeDetectorRef,
    public cepApi: cepApiBrasilService,
    private empresaApi: registroEmpresaApi,
    private activeRoute: loadingService,
    private router: Router,
  ) { }
  ngOnInit(): void {
    this.form.empresaform.get('cep')?.valueChanges.subscribe((cep) => {
      if (cep && cep.length === 8) {
        this.buscarEnderecoPorCep(cep);
      }
    });
  }

  stepFields: Record<number, EmpresaFormControls[]> = {
    1: ['nomeCompania', 'numeroDeTelefone', 'email'],
    2: ['cep', 'estado_sigla', 'cidade', 'bairro', 'rua', 'numeroEndereco'],
    3: []
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

  buscarEnderecoPorCep(cep: string) {
    const sanitizedCep = cep.replace(/\D/g, '');
    this.cepApi.consultarCep(sanitizedCep).subscribe((res: any) => {
      if (!res.erro) {
        this.form.empresaform.patchValue({
          estado_sigla: res.state,
          cidade: res.city,
          bairro: res.neighborhood,
          rua: res.street
        });
      }
    });
  }

  onSubmit() {
    if (!this.isCurrentStepValid()) {
      this.markCurrentStepTouched();
      return;
    }

    const formData = this.form.empresaform.value;

    // Suponha que essas informações vêm de outras fontes
    const usuarioLogado = 2; // contém uid, email, etc.
    const planoSelecionado = "";     // plano escolhido em outro momento

    const empresaPayload = {
      nomeCompania: formData.nomeCompania,
      razaoSocial: formData.razaoSocial || null,
      cnpj: formData.cnpj || null,
      cpfResponsavel: 61688140352,
      email: formData.email,
      telefone: formData.numeroDeTelefone,
      clienteId: usuarioLogado,
      endereco: {
        cep: formData.cep,
        rua: formData.rua,
        numero: formData.numeroEndereco,
        bairro: formData.bairro,
        cidade: formData.cidade,
        estado: formData.estado_sigla,
        logradouro: formData.complemento
      }
    };

    console.log('Payload enviado para API:', empresaPayload);
    this.empresaApi.registroEmpresa(empresaPayload).subscribe({
      next: (res) => {
        console.log('Empresa cadastrada com sucesso:', res);
        this.activeRoute.activeLoading()
        setTimeout(() => {
          this.router.navigateByUrl('/loading', { skipLocationChange: true }).then(() => {
            setTimeout(() => {
              this.router.navigate(['/admin']);
            }, 1000);
          });
        }, 0);
      },
      error: (err) => {
        console.error('Erro ao cadastrar empresa:', err);
      }
    });
  }

}

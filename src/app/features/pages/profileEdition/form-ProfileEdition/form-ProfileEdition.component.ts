import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { registroForm } from '../../../../services/singNupForm/registroForm.servide';
import { SnackService } from '../../../../services/snackBar/snack.service';
import { NgxMaskDirective } from 'ngx-mask';
import { cepApiBrasilService } from '../../../../services/cepApiBrasil/cep.service';

@Component({
  selector: 'app-form-ProfileEdition',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatTabsModule, NgxMaskDirective],
  templateUrl: './form-ProfileEdition.component.html',
  styleUrls: ['./form-ProfileEdition.component.scss'],

})
export class FormProfileEditionComponent implements AfterViewInit, OnInit {
  emailUser: any
  usuarioId: any

  @ViewChild('primeiroInput') primeiroInput!: ElementRef;


  constructor(
    public form: registroForm,
    private snak: SnackService,
    public cepApi: cepApiBrasilService,
  ) { }

  ngAfterViewInit(): void {
    this.focarPrimeiroCampo();
  }
  
  ngOnInit(): void {
    this.form.groupform.get('cep')?.valueChanges.subscribe((cep) => {
      if (cep && cep.length === 8) {
        this.buscarEnderecoPorCep(cep);
      }
    });
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

  isRequired(nome: string): boolean {
    const control = this.form.groupform.get(nome);
    if (!control) return false;

    const isTouched = control.touched;
    const hasRequiredError = control.errors?.['required'];
    const hasEmailError = (nome === 'email') && control.errors?.['emailInvalido'];
    const hasCepError = (nome === 'cep') && control.errors?.['cepInvalido'];
    const hasCpfCnpjError = (nome === 'cpfCnpj') &&
      (control.errors?.['cpfInvalido'] || control.errors?.['cnpjInvalido']);


    return (hasRequiredError && isTouched) || hasEmailError || hasCepError || hasCpfCnpjError;
  }

  buscarEnderecoPorCep(cep: string) {
    const sanitizedCep = cep.replace(/\D/g, '');
    this.cepApi.consultarCep(sanitizedCep).subscribe((res: any) => {
      if (!res.erro) {
        this.form.groupform.patchValue({
          estado_sigla: res.state,
          cidade: res.city,
          bairro: res.neighborhood,
          rua: res.street
        });
      }
    });
  }

}

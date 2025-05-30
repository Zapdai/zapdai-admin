import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { cadastroEmpresaForm } from '../../../services/cadastroEmpresa/cadastroEmpresa.servide';
import { NgxMaskDirective } from 'ngx-mask';
import { loadingService } from '../../../services/loading/loading.service';
import { Router } from '@angular/router';
import { resetPasswordForm } from '../../../services/resetPassword/resetPassword.servide';
import { InputOtpModule } from 'primeng/inputotp';
import { InputOtp } from 'primeng/inputotp';
import { inputOPTComponent } from "../inputOPT/inputOPT.component";

type ResetPasswordControls = keyof resetPasswordForm['passwordform']['controls'];

@Component({
  selector: 'app-form-resetPassword',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, NgxMaskDirective, InputOtpModule, FormsModule, inputOPTComponent],
  templateUrl: './form-resetPassword.component.html',
  styleUrls: ['./form-resetPassword.component.scss']
})
export class FormResetPasswordComponent {
  @ViewChild('otpRef') otpComponent!: any;
  currentStep = 1;
  validoOPT: any
  codigoOTP: string = '';
  otpInvalido = false;


  constructor(
    public form: resetPasswordForm,
    private cd: ChangeDetectorRef,
    private activeRoute: loadingService,
    private router: Router,
  ) { }

  stepFields: Record<number, ResetPasswordControls[]> = {
    1: ['email'],
    2: [],
    3: []
  };


  onCodigoCompleto(codigo: string) {
    console.log('Código completo recebido:', codigo);
    // Aqui você chama a validação do OTP
    this.validarOTP(codigo);
  }

  validarOTP(codigo: string) {
    if (codigo === '123456') {
      this.otpInvalido = false;
      this.currentStep++;
    } else {
      this.otpInvalido = true;
    }
  }





  isRequired(nome: string): boolean {
    const control = this.form.passwordform.get(nome);
    if (!control) return false;

    const isTouched = control.touched;
    const hasRequiredError = control.errors?.['required'];
    const hasEmailError = (nome === 'email') && control.errors?.['emailInvalido'];

    return (hasRequiredError && isTouched) || hasEmailError;
  }

  markCurrentStepTouched() {
    const fields = this.stepFields[this.currentStep];
    fields.forEach(field => {
      this.form.passwordform.controls[field].markAsTouched();
    });
  }

  isCurrentStepValid(): boolean {
    const fields = this.stepFields[this.currentStep];
    return fields.every(field => this.form.passwordform.controls[field].valid);
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

  focarProximoCampo(proximoCampo: string) {
    const proximo = document.querySelector(`[formControlName="${proximoCampo}"]`) as HTMLElement;
    if (proximo) {
      proximo.focus();
    }
  }



  onSubmit() {
    if (!this.isCurrentStepValid()) {
      this.markCurrentStepTouched();
      return;
    }

    const formData = this.form.passwordform.value;

    // Suponha que essas informações vêm de outras fontes
    const usuarioLogado = 2; // contém uid, email, etc.
    const planoSelecionado = "";     // plano escolhido em outro momento

    const empresaPayload = {
      email: formData.email
    };

    // console.log('Payload enviado para API:', empresaPayload);
    // this.empresaApi.registroEmpresa(empresaPayload).subscribe({
    //   next: (res) => {
    //     console.log('Empresa cadastrada com sucesso:', res);
    //     this.activeRoute.activeLoading()
    //     setTimeout(() => {
    //       this.router.navigateByUrl('/loading', { skipLocationChange: true }).then(() => {
    //         setTimeout(() => {
    //           this.router.navigate(['/admin']);
    //         }, 1000);
    //       });
    //     }, 0);
    //   },
    //   error: (err) => {
    //     console.error('Erro ao cadastrar empresa:', err);
    //   }
    // });
  }

}

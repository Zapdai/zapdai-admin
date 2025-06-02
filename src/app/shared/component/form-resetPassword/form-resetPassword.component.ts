import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NgxMaskDirective } from 'ngx-mask';
import { loadingService } from '../../../services/loading/loading.service';
import { Router } from '@angular/router';
import { resetPasswordForm } from '../../../services/resetPassword/resetPassword.servide';
import { InputOtpModule } from 'primeng/inputotp';
import { verificationEmailApi } from '../../../services/verificationEmail/verificationEmailApi.service';
import { SnackService } from '../../../services/snackBar/snack.service';
import { InputOtp } from 'primeng/inputotp';
import { PasswordModule } from 'primeng/password';
import { PasswordStrengthBarComponent } from "../password/password-strength-bar.component";
import { MatIconModule } from '@angular/material/icon';
import { resetPasswordApi } from '../../../services/resetPassword/resetPasswordApi.service';
import e from 'express';

type ResetPasswordControls = keyof resetPasswordForm['passwordform']['controls'];

@Component({
  selector: 'app-form-resetPassword',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule, InputOtpModule, FormsModule, InputOtp, PasswordModule, PasswordStrengthBarComponent],
  templateUrl: './form-resetPassword.component.html',
  styleUrls: ['./form-resetPassword.component.scss']
})
export class FormResetPasswordComponent implements OnInit, AfterViewInit {
  currentStep = 1;
  ativo = false;
  icon: "visibility" | "visibility_off" = "visibility"

  @ViewChild('primeiroInput') primeiroInput!: ElementRef;

  constructor(
    public form: resetPasswordForm,
    private cd: ChangeDetectorRef,
    private activeRoute: loadingService,
    private router: Router,
    private verificationEmailApi: verificationEmailApi,
    private resetPasswordApi: resetPasswordApi,
    private snack: SnackService,
  ) { }


  stepFields: Record<number, ResetPasswordControls[]> = {
    1: ['email'],
    2: ['code'],
    3: ['password', 'repeatPassword']
  };

  ngAfterViewInit(): void {
    this.focarPrimeiroCampo();
  }

  ngOnInit(): void {
    const codeControl = this.form.passwordform.get('code');
    if (codeControl) {
      codeControl.valueChanges.subscribe(value => {
        if (value && value !== value.toUpperCase()) {
          codeControl.setValue(value.toUpperCase(), { emitEvent: false });
        }
      });
    }
  }


  visible() {
    if (this.icon === "visibility") {
      this.icon = "visibility_off"
      this.ativo = true;
    } else {
      this.icon = "visibility"
      this.ativo = false;
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

  getFirstPasswordErrorMessage(): string | null {
    const control = this.form.passwordform.get('password');
    if (!control || !control.errors) return null;

    const errors = control.errors;

    if (errors['minLength']) {
      return 'A senha precisa ter pelo menos 8 caracteres.';
    }
    if (errors['minUppercase']) {
      return 'A senha precisa conter pelo menos uma letra maiúscula.';
    }
    if (errors['minLowercase']) {
      return 'A senha precisa conter pelo menos uma letra minúscula.';
    }
    if (errors['minNumbers']) {
      return 'A senha precisa conter pelo menos um número.';
    }
    if (errors['minSymbols']) {
      return 'A senha precisa conter pelo menos um símbolo especial.';
    }

    return null; // sem erros
  }

  senhasNaoConferem(): boolean {
    return (
      this.form.passwordform.hasError('senhasDiferentes') &&
      !!this.form.passwordform.get('repeatPassword')?.touched
    );
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

  enviarCodigoEmail() {
    const email = this.form.passwordform.value.email;

    if (!email) {
      this.form.passwordform.controls['email'].markAsTouched();
      return;
    }

    const payload = { email };

    this.verificationEmailApi.geraCodeEmail(payload).subscribe((e: any) => {
      this.currentStep = 2; // Avança para o passo de verificação
      this.snack.success(e.msg)
    });
  }


  validarCodigo() {
    const email = this.form.passwordform.value.email;
    const code = this.form.passwordform.value.code;

    if (!email || !code) return;

    this.verificationEmailApi.verificationCodeEmail({ email, code }).subscribe((res: any) => {
      if (res.msg) {
        this.currentStep++;
      }

    });
  }


  novaSenha() {
    const email = this.form.passwordform.value.email;
    const password = this.form.passwordform.value.password;
    const repeatPassword = this.form.passwordform.value.repeatPassword;

    if (!email || !password) return;

    if (password === repeatPassword) {
      this.resetPasswordApi.resetPassword({ email, password }).subscribe((res: any) => {
        if (res.msg) {
          this.form.passwordform.reset()
          this.snack.success(res.msg)
          this.activeRoute.activeLoading()
          setTimeout(() => {
            this.router.navigateByUrl('/loading', { skipLocationChange: true }).then(() => {
              setTimeout(() => {
                this.router.navigate(['/auth/signin']);
              }, 1000);
            });
          }, 0);
        }

      });
    } else {
      this.snack.error("Senhas não conferem!")
    }

  }


  focarPrimeiroCampo() {
    if (this.primeiroInput && this.primeiroInput.nativeElement) {
      this.primeiroInput.nativeElement.focus();
    }
  }

  pageSignin() {
    this.activeRoute.activeLoading()
    setTimeout(() => {
      this.router.navigateByUrl('/loading', { skipLocationChange: true }).then(() => {
        setTimeout(() => {
          this.router.navigate(['/auth/signin'])
        }, 1000);
      })

    }, 0);
  }

  pageSignup() {
    this.activeRoute.activeLoading()
    setTimeout(() => {
      this.router.navigateByUrl('/loading', { skipLocationChange: true }).then(() => {
        setTimeout(() => {
          this.router.navigate(['/auth/signup']);
        }, 1000);
      });
    }, 0);
  }
}

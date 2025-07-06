import { AfterViewInit, Component, ElementRef, HostListener, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
import { AuthDecodeService } from '../../../services/AuthUser.service';
import { Location } from '@angular/common';
import { NgxOtpInputComponent, NgxOtpInputComponentOptions } from 'ngx-otp-input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { firstValueFrom } from 'rxjs';
type ResetPasswordControls = keyof resetPasswordForm['passwordform']['controls'];

@Component({
  selector: 'app-form-resetPassword',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule, InputOtpModule, FormsModule, MatProgressSpinnerModule, NgxOtpInputComponent, PasswordModule, PasswordStrengthBarComponent],
  templateUrl: './form-resetPassword.component.html',
  styleUrls: ['./form-resetPassword.component.scss']
})
export class FormResetPasswordComponent implements OnInit, AfterViewInit {
  currentStep = 1;
  ativo = false;
  icon: "visibility" | "visibility_off" = "visibility"
  isVisible = false;
  carregando = false;

  otpOptions: NgxOtpInputComponentOptions = {
    otpLength: 6,
    autoFocus: true,
    autoBlur: true,
    hideInputValues: false,
    inputMode: 'text',
    regexp: /^[a-zA-Z0-9]*$/,
  };

  @ViewChild('primeiroInput') primeiroInput!: ElementRef;
  @ViewChild('otpContainer') otpContainer!: ElementRef;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public form: resetPasswordForm,
    private cd: ChangeDetectorRef,
    private activeRoute: loadingService,
    private router: Router,
    private verificationEmailApi: verificationEmailApi,
    private resetPasswordApi: resetPasswordApi,
    private snack: SnackService,
    public authDecodeUser: AuthDecodeService,
    private location: Location,
  ) { }


  stepFields: Record<number, ResetPasswordControls[]> = {
    1: ['email'],
    2: ['code'],
    3: ['password', 'repeatPassword']
  };

  ngAfterViewInit(): void {
    this.focarPrimeiroCampo()
  }

  ngOnInit(): void {

    if (this.authDecodeUser.getSub()) {
      this.form.passwordform.get('email')?.setValue(this.authDecodeUser.getSub());
    }


    if (isPlatformBrowser(this.platformId)) {
      this.checkWindowSize();
    }
  }




  @HostListener('window:resize')
  onResize() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkWindowSize();
    }
  }

  checkWindowSize() {
    this.isVisible = window.innerWidth <= 767;
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

  @HostListener('document:keydown.enter', ['$event'])
  handleEnterKey(event: KeyboardEvent) {
    if (this.isCurrentStepValid() && !this.carregando) {
      this.validarCodigo();
    }
  }

  onCodeChange(codeArray: string[]) {
    const otpValue = codeArray.join('').trim().replace(/\s+/g, '').toUpperCase();
    const codeControl = this.form.passwordform.get('code');
    if (codeControl) {
      codeControl.setValue(otpValue);
      codeControl.markAsDirty();
      codeControl.markAsTouched();
      this.cd.detectChanges();
    }
  }


  onOtpComplete(code: string) {
    const cleaned = code.trim().replace(/\s+/g, '').toUpperCase(); // Remove espaços em excesso
    this.form.passwordform.get('code')?.setValue(cleaned);
    this.validarCodigo();
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

  async enviarCodigoEmail() {
    const email = this.form.passwordform.value.email;

    if (!email) {
      this.form.passwordform.controls['email'].markAsTouched();
      return;
    }

    if (this.carregando) {
      return; // evita chamadas múltiplas
    }

    this.carregando = true;

    const payload = { email };

    try {
      const response: any = await firstValueFrom(this.verificationEmailApi.geraCodeEmail(payload))

      if (response.msg) {
        this.currentStep = 2; // Avança para o passo de verificação
        this.snack.success(response.msg)
        this.carregando = false;
      }
    } catch {
      this.carregando = false;
    }
  }


  async validarCodigo() {
    const email = this.form.passwordform.value.email;
    const code = this.form.passwordform.value.code;

    if (this.carregando) {
      return; // evita chamadas múltiplas
    }

    if (!email || !code) return;


    this.carregando = true;
    try {
      const response: any = await firstValueFrom(this.verificationEmailApi.verificationCodeEmail({ email, code }))
      if (response.msg) {
        this.currentStep++;
        this.carregando = false;
      } else {
        this.carregando = false;
      }

    } catch {
      this.carregando = false;
    }
  }


  novaSenha() {
    const email = this.form.passwordform.value.email;
    const newPasswd = this.form.passwordform.value.password;
    const repeatPassword = this.form.passwordform.value.repeatPassword;

    if (!email || !newPasswd) return;

    if (newPasswd === repeatPassword) {
      this.resetPasswordApi.resetPassword({ email, newPasswd }).subscribe((res: any) => {
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

  voltarPaginaAnterior() {
    this.location.back();
  }
}

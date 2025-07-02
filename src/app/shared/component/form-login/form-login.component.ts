import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { apiAuthService } from '../../../services/apiAuth.service';
import { AuthService } from '../../../services/auth.service';
import { loadingService } from '../../../services/loading/loading.service';
import { loginFormService } from '../../../services/loginService/loginForm.servide';
import { SnackService } from '../../../services/snackBar/snack.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Usuario } from '../../core/types/usuario';

@Component({
  selector: 'app-form-login',
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule, MatIconModule, MatButtonModule],
  templateUrl: './form-login.component.html',
  styleUrl: './form-login.component.scss'
})
export class FormLoginComponent {
  @ViewChild("form1", { static: true }) form1!: ElementRef
  @ViewChild("form2", { static: true }) form2!: ElementRef


  constructor(
    public service: loginFormService,
    private auth: apiAuthService,
    private router: Router,
    private activeRoute: loadingService,
    private authService: AuthService,
    private snack: SnackService,
    private apiAuth: apiAuthService,
  ) {
  }

  ativo = false;
  icon: "visibility" | "visibility_off" = "visibility"
  select<T>(name: string) {
    const form = this.service.groupform.get(name)

    if (!form) {
      throw new Error('Nome inválido!!!')
    }
    return form as FormControl
  }

  data(): any {
    const dataName = {
      email: this.select('email').value.toLowerCase(),
      password: this.select('password').value
    }
    return dataName
  }

  mudaCompo(event: any) {
    if (event) {
      event.focus()
    }
  }
  btn() {
    this.auth.login(this.data()).subscribe(item => {
      this.service.groupform.reset()
      if (item.authToken !== null) {
        this.authService.saveToken(item.authToken);


        // Recupera a URL salva (ou define '/' como padrão)
        const returnUrl = localStorage.getItem('returnUrl') || '/';
        localStorage.removeItem('returnUrl'); // limpa após usar

        // Redireciona para a página original
        setTimeout(() => {
          this.router.navigateByUrl('/loading', { skipLocationChange: true }).then(() => {
            setTimeout(() => {
              window.location.href = returnUrl;
            }, 1000);
          });
        }, 0);
      }
    });
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

  pageLoginWhatsapp() {
    this.activeRoute.activeLoading()
    setTimeout(() => {
      this.router.navigateByUrl('/loading', { skipLocationChange: true }).then(() => {
        setTimeout(() => {
          this.router.navigate(['/auth/signincode']);
        }, 1000);
      });
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

  pageResetPassword() {
    this.activeRoute.activeLoading()
    setTimeout(() => {
      this.router.navigateByUrl('/loading', { skipLocationChange: true }).then(() => {
        setTimeout(() => {
          this.router.navigate(['/auth/resetPassword'], { skipLocationChange: false });
        }, 1000);
      });
    }, 0);
  }

  isRequiredEmail() {
    return this.service.groupform.get('email')?.errors?.['required'] && this.service.groupform.get('email')?.touched
  }

  isRequiredPassword() {
    return this.service.groupform.get('password')?.errors?.['required'] && this.service.groupform.get('password')?.touched
  }


}

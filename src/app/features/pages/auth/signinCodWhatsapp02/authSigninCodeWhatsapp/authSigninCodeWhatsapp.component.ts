import { AfterViewInit, Component, ElementRef, HostListener, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NgxMaskDirective } from 'ngx-mask';
import { ActivatedRoute, Router } from '@angular/router';
import { InputOtpModule } from 'primeng/inputotp';
import { InputOtp } from 'primeng/inputotp';
import { PasswordModule } from 'primeng/password';
import { MatIconModule } from '@angular/material/icon';
import { Location } from '@angular/common';
import { loadingService } from '../../../../../services/loading/loading.service';
import { SnackService } from '../../../../../services/snackBar/snack.service';
import { AuthDecodeService } from '../../../../../services/AuthUser.service';
import { apiAuthService } from '../../../../../services/apiAuth.service';
import { AuthService } from '../../../../../services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { firstValueFrom } from 'rxjs';

type verificationOPT = {
  code: number;
}

@Component({
  selector: 'app-authSigninCodeWhatsapp',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    InputOtpModule,
    FormsModule,
    InputOtp,
    PasswordModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './authSigninCodeWhatsapp.component.html',
  styleUrls: ['./authSigninCodeWhatsapp.component.scss']
})
export class AuthSigninCodeWhatsappComponent implements OnInit, AfterViewInit {
  currentStep = 1;
  ativo = false;
  icon: "visibility" | "visibility_off" = "visibility"
  isVisible = false;
  carregando = false;
  groupform!: FormGroup;
  tokenkey: any;
  numeroWhatsapp: any;
  reenviarDisponivel = true;
  contador: number = 0;
  intervalo: any;

  @ViewChild('primeiroInput', { static: false, read: ElementRef }) primeiroInput!: ElementRef;


  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cd: ChangeDetectorRef,
    private activeRoute: loadingService,
    private router: Router,
    private snack: SnackService,
    public authDecodeUser: AuthDecodeService,
    private location: Location,
    private apiAuth: apiAuthService,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) { }


  stepFields: Record<number, string[]> = {
    1: ['code'],
  };

  ngAfterViewInit(): void {
    this.focarPrimeiroCampo();
  }

  ngOnInit(): void {
    this.CarregaFormGroup({ code: 0 });


    this.route.queryParamMap.subscribe(params => {
      this.tokenkey = params.get('token');
      this.numeroWhatsapp = params.get('numeroWhatsapp');

      if (this.numeroWhatsapp) {
        this.groupform.patchValue({ numeroWhatsapp: this.numeroWhatsapp });
      } else {
        this.pageLoginWhatsapp(); // se não tiver número, redireciona
      }
    });

    const codeControl = this.groupform.get('code');
    if (codeControl) {
      codeControl.valueChanges.subscribe(value => {
        if (value && value !== value.toUpperCase()) {
          codeControl.setValue(value.toUpperCase(), { emitEvent: false });
        }
      });
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

  CarregaFormGroup(verificationOPT: verificationOPT) {
    this.groupform = new FormGroup({
      numeroWhatsapp: new FormControl('', Validators.required),
      code: new FormControl('', [Validators.required, Validators.minLength(6)])
    })
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
    const control = this.groupform.get(nome);
    if (!control) return false;

    const isTouched = control.touched;
    const hasRequiredError = control.errors?.['required'];

    return (hasRequiredError && isTouched);
  }


  markCurrentStepTouched() {
    const fields = this.stepFields[this.currentStep];
    fields.forEach(field => {
      this.groupform.controls[field].markAsTouched();
    });
  }

  isCurrentStepValid(): boolean {
    const fields = this.stepFields[this.currentStep];
    return fields.every(field => this.groupform.controls[field].valid);
  }

  async renviarCodigoWhatsAppp() {
    const numeroWhatsapp = this.groupform.value.numeroWhatsapp;

    if (!numeroWhatsapp || numeroWhatsapp === '') {
      this.pageLoginWhatsapp(); // redireciona se o número estiver vazio
      return;
    }

    if (!this.reenviarDisponivel) {
      return; // evita múltiplos envios durante o tempo de espera
    }

    this.reenviarDisponivel = false;
    this.contador = 30; // segundos

    this.intervalo = setInterval(() => {
      this.contador--;
      if (this.contador <= 0) {
        clearInterval(this.intervalo);
        this.reenviarDisponivel = true;
      }
    }, 1000);

    const payload = { number: numeroWhatsapp };

    try {
      const response: any = await firstValueFrom(this.apiAuth.sendCodeWhatsapp(payload));
      this.snack.success(response.message);
    } finally {
      // se der erro e quiser reabilitar antes dos 60s, pode limpar aqui
    }
  }



  AuthUserCodeWhatsapp() {
    const payload = {
      code: this.groupform.value.code?.trim()
    };

    if (this.carregando) {
      return; // evita chamadas múltiplas
    }

    const numeroWhatsapp = this.groupform.value.numeroWhatsapp;

    if (!this.groupform.value.code?.trim()) {
      this.groupform.controls['numeroWhatsapp'].markAsTouched();
      return;
    }

    this.carregando = true;

    this.apiAuth.signinCodeWhatsapp(payload, this.tokenkey).subscribe({
      next: (item) => {

        this.groupform.reset();

        if (item.authToken !== null) {
          this.authService.saveToken(item.authToken);

          const returnUrl = localStorage.getItem('returnUrl') || '/';
          localStorage.removeItem('returnUrl');

          setTimeout(() => {
            this.router.navigateByUrl('/loading', { skipLocationChange: true }).then(() => {
              setTimeout(() => {
                window.location.href = returnUrl;
              }, 1000);
            });
          }, 0);
        }
      },
      error: (err) => {
        this.carregando = false;
      }
    });
  }




  focarPrimeiroCampo() {
    if (this.primeiroInput && this.primeiroInput.nativeElement) {
      this.primeiroInput.nativeElement.focus();
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

  voltarPaginaAnterior() {
    this.location.back();
  }
}

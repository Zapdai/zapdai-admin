import { AfterViewInit, Component, ElementRef, HostListener, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NgxMaskDirective } from 'ngx-mask';
import { Router } from '@angular/router';
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
  numeroWhatsapp: number;
  code: number;
}

@Component({
  selector: 'app-sendCodeWhatsapp',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    InputOtpModule,
    FormsModule,
    PasswordModule,
    NgxMaskDirective,
    MatProgressSpinnerModule,
  ],
  templateUrl: './sendCodeWhatsapp.component.html',
  styleUrls: ['./sendCodeWhatsapp.component.scss']
})
export class SendCodeWhatsappComponent implements OnInit, AfterViewInit {
  currentStep = 1;
  ativo = false;
  icon: "visibility" | "visibility_off" = "visibility"
  isVisible = false;
  groupform!: FormGroup;
  carregando = false;

  @ViewChild('primeiroInput', { static: false }) primeiroInput!: ElementRef;


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
  ) { }


  stepFields: Record<number, string[]> = {
    1: ['numeroWhatsapp'],
    2: ['code'],
  };

  ngAfterViewInit(): void {
    this.focarPrimeiroCampo();
  }

  ngOnInit(): void {
    this.CarregaFormGroup({ numeroWhatsapp: 0, code: 0 }); // apenas para inicializar
    if (this.carregando) {
      this.groupform.get('numeroWhatsapp')?.disable();
    } else {
      this.groupform.get('numeroWhatsapp')?.enable();
    }


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

  async enviarCodigoWhatsAppp() {
    if (this.carregando) {
      return; // evita chamadas múltiplas
    }

    const numeroWhatsapp = this.groupform.value.numeroWhatsapp;

    if (!numeroWhatsapp) {
      this.groupform.controls['numeroWhatsapp'].markAsTouched();
      return;
    }

    this.carregando = true;

    const payload = { number: numeroWhatsapp };

    try {
      const response: any = await firstValueFrom(this.apiAuth.sendCodeWhatsapp(payload));
      this.snack.success(response.message);

      this.router.navigate(['/auth/signincode/autentication'], {
        queryParams: { 
          token: response.token,
          numeroWhatsapp: numeroWhatsapp
         },
        skipLocationChange: false,
      });

    } finally {
      this.carregando = false;
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

  voltarPaginaAnterior() {
    this.location.back();
  }
}

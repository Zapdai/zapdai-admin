import { AfterViewInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { SnackService } from '../../../../services/snackBar/snack.service';
import { NgxMaskDirective } from 'ngx-mask';
import { cepApiBrasilService } from '../../../../services/cepApiBrasil/cep.service';
import { MatIconModule } from '@angular/material/icon';
import { TabsModule } from 'primeng/tabs';
import { trigger, transition, style, animate } from '@angular/animations';
import { apiAuthService } from '../../../../services/apiAuth.service';
import { AuthDecodeService } from '../../../../services/AuthUser.service';
import { Usuario } from '../../../../shared/core/types/usuario';
import { cpfOuCnpjValidator, validarCep, validarEmail } from '../../../../../validators';

@Component({
  selector: 'app-form-ProfileEdition',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatTabsModule, NgxMaskDirective, MatIconModule, TabsModule,],
  templateUrl: './form-ProfileEdition.component.html',
  styleUrls: ['./form-ProfileEdition.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]

})
export class FormProfileEditionComponent implements AfterViewInit, OnInit {
  activeTab = 'pessoal';
  usuario!: Usuario;
  valida: any;
  latitude: number | null = null;
  longitude: number | null = null;
  error: string | null = null;
   groupform!:FormGroup;

  @ViewChild('primeiroInput') primeiroInput!: ElementRef;


  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private snak: SnackService,
    public cepApi: cepApiBrasilService,
    private apiAuth: apiAuthService,
    public authDecodeUser: AuthDecodeService,
  ) { }

  ngAfterViewInit(): void {
    this.focarPrimeiroCampo();
  }

  ngOnInit(): void {
        this.getUser()
     this.groupform.get('cep')?.valueChanges.subscribe((cep:any) => {
      if (cep && cep.length === 8) {
        this.buscarEnderecoPorCep(cep);
      }
    });
    this.pegaLatLog()
   
  }
  
CarregaFormGroup(usuario:Usuario){
  this.groupform =  new FormGroup({
            nome: new FormControl(usuario!.nome, Validators.required),
            telefone: new FormControl(usuario.phoneNumer, Validators.required),
            sexo: new FormControl(usuario.sexo, Validators.required),
            email: new FormControl(usuario.email, [Validators.required, Validators.email, validarEmail]),
            cpf: new FormControl(usuario.cpf, [Validators.required, Validators.minLength(11), cpfOuCnpjValidator]),
    
            cep: new FormControl(usuario.endereco?.cep, [Validators.required, validarCep]),
            estado_sigla: new FormControl(usuario.endereco?.estado_sigla, Validators.required),
            cidade: new FormControl(usuario.endereco?.cidade, Validators.required),
            bairro: new FormControl(usuario.endereco?.bairro, Validators.required),
            logradouro: new FormControl(usuario.endereco?.logradouro, Validators.required),
            numeroEndereco: new FormControl(usuario.endereco?.numeroEndereco, Validators.required),
            dataNascimento:new FormControl(`${usuario.dataNascimento}`)
     })
}


  getUser() {
        this.apiAuth.buscaUsuario(this.authDecodeUser.getSub()).subscribe((usuario: any) => {
          this.valida = usuario;
          if (usuario !== null) {
            this.usuario = usuario;
            this.CarregaFormGroup(usuario)
          }
        
    })
  }


  setTab(tab: string) {
    this.activeTab = tab;
     this.getUser()
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
    const control = this.groupform.get(nome);
    if (!control) return false;

    const isTouched = control.touched;
    const hasRequiredError = control.errors?.['required'];
    const hasEmailError = (nome === 'email') && control.errors?.['emailInvalido'];
    const hasCepError = (nome === 'cep') && control.errors?.['cepInvalido'];
    const hasCpfCnpjError = (nome === 'cpfCnpj') &&
      (control.errors?.['cpfInvalido'] || control.errors?.['cnpjInvalido']);


    return (hasRequiredError && isTouched) || hasEmailError || hasCepError || hasCpfCnpjError;
  }

  select<T>(nome: string) {
    const data = this.groupform?.get(nome);
    if (!data) {
      throw new Error('Nome inválido!!!');
    }
    return data as FormControl;
  }

  dataUser(): any {
    const data =  {
      id:this.authDecodeUser.getusuarioId(),
      nome: this.select("nome").value || this.usuario.nome,
      numero: this.select("telefone").value || this.usuario.phoneNumer,
      sexo: this.select("sexo").value || this.usuario.sexo,
      endereco: {
        numeroEndereco: this.select("numeroEndereco").value,
        latLong: `${this.latitude}, ${this.longitude}`,
        logradouro: this.select("logradouro").value,
        estado_sigla: this.select("estado_sigla").value,
        cep: this.select("cep").value,
        bairro: this.select("bairro").value,
        cidade: this.select("cidade").value,
      }
    };
    return data;
  }

  AtualizarUsuario() {
    this.apiAuth.updateUsuario(this.dataUser()).subscribe((res:any)=>{
      if(res){
        this.snak.success(res.msg);
      }
    }
    )
    
  }



  pegaLatLog() {
    if (isPlatformBrowser(this.platformId)) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
          },
          (err) => {
            this.error = 'Erro ao obter localização: ' + err.message;
            console.error(this.error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      } else {
        this.error = 'Geolocalização não suportada no navegador.';
        console.error(this.error);
      }
    } else {
      console.warn('Código executado fora do browser.');
    }
  }

  buscarEnderecoPorCep(cep: string) {
    const sanitizedCep = cep.replace(/\D/g, '');
    this.cepApi.consultarCep(sanitizedCep).subscribe((res: any) => {
      if (!res.erro) {
        this.groupform.patchValue({
          estado_sigla: res.state,
          cidade: res.city,
          bairro: res.neighborhood,
          logradouro: res.street
        });
      }
    });
  }

}

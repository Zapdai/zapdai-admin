import { AfterViewInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { registroForm } from '../../../../services/singNupForm/registroForm.servide';
import { SnackService } from '../../../../services/snackBar/snack.service';
import { NgxMaskDirective } from 'ngx-mask';
import { cepApiBrasilService } from '../../../../services/cepApiBrasil/cep.service';
import { MatIconModule } from '@angular/material/icon';
import { TabsModule } from 'primeng/tabs';
import { trigger, transition, style, animate } from '@angular/animations';
import { apiAuthService } from '../../../../services/apiAuth.service';
import { AuthDecodeService } from '../../../../services/AuthUser.service';
import { Usuario } from '../../../../shared/core/types/usuario';
import { cadastro } from '../../../../shared/core/types/cadastroUpdateUser';

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
  emailUser: any
  usuarioId: any
  activeTab = 'pessoal';
  usuario!: Usuario;
  valida: any;
  latitude: number | null = null;
  longitude: number | null = null;
  error: string | null = null;

  @ViewChild('primeiroInput') primeiroInput!: ElementRef;


  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public form: registroForm,
    private snak: SnackService,
    public cepApi: cepApiBrasilService,
    private apiAuth: apiAuthService,
    public authDecodeUser: AuthDecodeService,
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

    this.getUser()

    this.pegaLatLog()

  }

  getUser() {
    new Promise((resove) => {
      resove(
        this.apiAuth.buscaUsuario(this.authDecodeUser.getSub()).subscribe((usuario: Usuario) => {
          this.valida = usuario;
          if (usuario !== null) {
            this.usuario = usuario;

            this.form.groupform.patchValue({
              name: this.usuario.nome,
              sexo: this.usuario.sexo,
              telefone: this.usuario.phoneNumer,
              dataNascimento: this.usuario.dataNascimento,
              cep: '54444444',
              estado_sigla: 'this.usuario.',
              cidade: 'res.city',
              bairro: 'res.neighborhood',
              rua: 'res.street',
              numeroEndereco: '54',
              complemento: 'gf'
            });
          }
        })
      )
    })
  }


  setTab(tab: string) {
    this.activeTab = tab;
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

  select<T>(nome: string) {
    const data = this.form.groupform?.get(nome);
    if (!data) {
      throw new Error('Nome inválido!!!');
    }
    return data as FormControl;
  }

  get dataUser(): cadastro {
    return {
      "id": this.authDecodeUser.getusuarioId(),
      "nome": this.select("name").value || this.usuario.nome,
      "phoneNumer": this.select("telefone").value || this.usuario.phoneNumer,
      "sexo": this.select("sexo").value || this.usuario.sexo,
      "endereco": {
        "numeroEndereco": this.select("numeroEndereco").value,
        "latLong": `${this.latitude}, ${this.longitude}`,
        "rua": this.select("rua").value,
        "complemento": this.select("complemento").value,
        "estado": this.select("estado_sigla").value,
        "cep": this.select("cep").value,
        "bairro": this.select("bairro").value,
        "cidade": this.select("cidade").value,
      }
    };
  }

  AtualizarUsuario() {
    const dados = this.dataUser;

    this.apiAuth.updateUsuario(dados).subscribe({
      next: (res) => {
        this.snak.success(res.msg);
      },
      error: (err) => {
        console.error('Erro ao atualizar usuário:', err);
        this.snak.error(err);
      }
    });
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

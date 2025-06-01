import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { cadastroEmpresaForm } from '../../../services/cadastroEmpresa/cadastroEmpresa.servide';
import { cepApiBrasilService } from '../../../services/cepApiBrasil/cep.service';
import { NgxMaskDirective } from 'ngx-mask';
import { registroEmpresaApi } from '../../../services/cadastroEmpresa/registroEmpresaApi.service';
import { loadingService } from '../../../services/loading/loading.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MatChipsModule } from '@angular/material/chips';
import { itens, itensPlanos } from '../../core/Plano/planosItens';
import { PlanoService } from '../../../services/planosServices/planos.service';
import { SnackService } from '../../../services/snackBar/snack.service';

type EmpresaFormControls = keyof cadastroEmpresaForm['empresaform']['controls'];

@Component({
  selector: 'app-form-cadastro-empresa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, NgxMaskDirective, MatChipsModule],
  templateUrl: './form-cadastro-empresa.component.html',
  styleUrls: ['./form-cadastro-empresa.component.scss'],

})
export class FormCadastroEmpresaComponent implements OnInit, AfterViewInit {
  currentStep = 1;
  emailUser: string = ''
  usuarioId = ''
  itensPlanos: itensPlanos = { planos: [] };
  planoSelecionado: any = null;


  @ViewChild('primeiroInput') primeiroInput!: ElementRef;


  constructor(
    public form: cadastroEmpresaForm,
    private cd: ChangeDetectorRef,
    public cepApi: cepApiBrasilService,
    private empresaApi: registroEmpresaApi,
    private activeRoute: loadingService,
    private router: Router,
    private authService: AuthService,
    private apiPlanosService: PlanoService,
    private route: ActivatedRoute,
    private snack: SnackService,
  ) { }

  ngAfterViewInit(): void {
    this.focarPrimeiroCampo();
  }

  ngOnInit(): void {
    this.emailUser = this.authService.getFromToken('sub')!;
    this.usuarioId = this.authService.getFromToken('usuarioId')!;

    this.buscaPlanoUrl()

    this.apiPlanosService.planosConsumoApi().subscribe(response => {
      this.itensPlanos = response;
    });

    this.form.empresaform.get('cep')?.valueChanges.subscribe((cep) => {
      if (cep && cep.length === 8) {
        this.buscarEnderecoPorCep(cep);
      }
    });
  }

  buscaPlanoUrl() {
    const planoId = this.route.snapshot.queryParamMap.get('planoId');


    if (planoId) {
      this.apiPlanosService.planosConsumoApi().subscribe(res => {
        const plano = res.planos.find(p => p.planoId === planoId);
        if (plano) {
          this.planoSelecionado = plano;
        }

        // Se já tiver plano selecionado, aplicar no form
        if (this.planoSelecionado) {
          this.form.empresaform.get('selectPlano')?.setValue(this.planoSelecionado.planoId);
        }
      });
    }
  }
  onPlanoSelecionado(event: any) {
    const planoIdSelecionado = event.value;

    // Buscar o objeto completo do plano selecionado no array
    this.planoSelecionado = this.itensPlanos.planos.find(p => p.planoId === planoIdSelecionado);
  }


  trackByPlanoId(index: number, item: itens): string {
    return item.planoId ?? index.toString();
  }


  stepFields: Record<number, EmpresaFormControls[]> = {
    1: ['nomeCompania', 'numeroDeTelefone', 'email'],
    2: ['cep', 'estado_sigla', 'cidade', 'bairro', 'rua', 'numeroEndereco'],
    3: ['selectPlano', 'cpfCnpj']
  };


  isRequired(nome: string): boolean {
    const control = this.form.empresaform.get(nome);
    if (!control) return false;

    const isTouched = control.touched;
    const hasRequiredError = control.errors?.['required'];
    const hasEmailError = (nome === 'email') && control.errors?.['emailInvalido'];
    const hasCepError = (nome === 'cep') && control.errors?.['cepInvalido'];
    const hasCpfCnpjError = (nome === 'cpfCnpj') &&
      (control.errors?.['cpfInvalido'] || control.errors?.['cnpjInvalido']);


    return (hasRequiredError && isTouched) || hasEmailError || hasCepError || hasCpfCnpjError;
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
      setTimeout(() => this.focarPrimeiroCampo(), 0);
    } else {
      this.markCurrentStepTouched();
    }
  }

  prev() {
    if (this.currentStep > 1) {
      this.currentStep--;
      setTimeout(() => this.focarPrimeiroCampo(), 0);
    }
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

    const empresaPayload = {
      nomeCompania: formData.nomeCompania,
      email: formData.email,
      cpfCnpj: formData.cpfCnpj,
      numeroDeTelefone: formData.numeroEndereco,
      planoId: this.planoSelecionado.planoId,
      endereco: {
        numeroEndereco: formData.numeroEndereco,
        latLong: "",
        rua: formData.rua,
        logradouro: formData.complemento,
        estado_sigla: formData.estado_sigla,
        cep: formData.cep,
        bairro: formData.bairro,
        cidade: formData.cidade
      },
      usuario: {
        id: this.usuarioId
      }
    }

    this.empresaApi.registroEmpresa(empresaPayload).subscribe({
      next: (res) => {
        this.snack.success('Empresa cadastrada com sucesso!')
        this.activeRoute.activeLoading()
        setTimeout(() => {
          this.router.navigateByUrl('/loading', { skipLocationChange: true }).then(() => {
            setTimeout(() => {
              this.router.navigate(['/admin']);
            }, 1000);
          });
        }, 0);
      }
    });
  }

}

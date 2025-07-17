import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { AsideComponent } from '../../../../shared/component/aside-modal/aside-modal.component';
import { MatInputModule } from '@angular/material/input';
import { CheckoutFormService } from '../../../../services/checkoutForm/checkoutForm.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';
import { MatIconModule } from '@angular/material/icon';
import { apiPaymentsService } from '../../../../services/checkoutForm/apiPayments.service';
import { PixPaymentRespons } from '../../../../shared/core/types/paymentPagamentopix';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { loadingService } from '../../../../services/loading/loading.service';
import { PopoverModule } from 'primeng/popover';
import { ButtonModule } from 'primeng/button';
import { itens } from '../../../../shared/core/Plano/planosItens';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackService } from '../../../../services/snackBar/snack.service';
import { AuthService } from '../../../../services/auth.service';
import { Subscription } from 'rxjs';
import { ConfirmPagamentoSocketComponent } from '../../../../services/pagamentosService/pagamentos.service';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { cepApiBrasilService } from '../../../../services/cepApiBrasil/cep.service';
import { IpService } from '../../../../services/IpDispositivoCliente/ipClient.service';
import { paymentAsaas } from '../../../../shared/core/types/paymentAsaas';
import { CheckoutPixAsaasComponent } from '../../../../shared/component/pixAsaas/checkoutPixAsaas.component';
import { AuthDecodeService } from '../../../../services/AuthUser.service';


@Component({
  selector: 'app-checkoutPlanos02',
  standalone: true,
  imports: [
    MatListModule,
    AsideComponent,
    CheckoutPixAsaasComponent,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    NgxMaskDirective,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    PopoverModule, ButtonModule,
    MatSnackBarModule,

  ],
  templateUrl: './checkout05Assas.component.html',
  styleUrls: ['./checkout05Assas.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Checkout05AssasComponent implements OnInit {
  spinner = false;
  response!: PixPaymentRespons;
  pagamentoData: any;
  isSmallScreen: boolean = false;
  datas!: any;
  event: any;
  pollingSub!: Subscription;
  pagamentoSub?: Subscription | null;
  ipClient: string = '';
  latitude: number | null = null;
  longitude: number | null = null;
  error: string | null = null;
  cpfCnpjMask: string = '000.000.000-00'; // padrão inicial
  selected: 'cpf' | 'cnpj' = 'cpf';
  planoSelecionado: any = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public form: CheckoutFormService,
    public payment: apiPaymentsService,
    private router: Router,
    private activeRoute: loadingService,
    private snack: SnackService,
    private socketService: ConfirmPagamentoSocketComponent,
    public cepApi: cepApiBrasilService,
    private ipClientApi: IpService,
    public authUser: AuthDecodeService,
    private route: ActivatedRoute,
  ) {


  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.pegaLatLog();
    }
    this.checkScreenWidth();

    this.pegaIpClient()

    this.form.checkoutForm.get('cep')?.valueChanges.subscribe((cep) => {
      if (cep && cep.length === 8) {
        this.buscarEnderecoPorCep(cep);
      }
    });
  }

  trackByPlanoId(index: number, item: itens): string {
    return item.planoId ?? index.toString();
  }

  pegaIpClient() {
    this.ipClientApi.getIPAddress().subscribe({
      next: (res) => {
        this.ipClient = res.ip;
      },
      error: (err) => {
        console.error('Erro ao buscar IP:', err);
      }
    });
  }

  pegaLatLog() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
        },
        (err) => {
          this.error = 'Erro ao obter localização: ' + err.message;
        },
        {
          enableHighAccuracy: true, // usa GPS se disponível
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      this.error = 'Geolocalização não suportada no navegador.';
    }
  }


  img = "/banners/banner-checkout01.png";
  ativo = false;
  activeTab: 'credito' | 'debito' | 'pix' = 'credito';
  NomeCompleto: string = '';
  primeiroNome: string = '';
  sobrenome: string = '';

  // Método para trocar aba
  setTab(novoTab: 'credito' | 'debito' | 'pix') {
    if (this.activeTab !== novoTab) {
      this.activeTab = novoTab;
    }
  }


  ativaModal() {
    this.ativo = false;
  }

  mudaCompo(event: any) {
    if (event) {
      event.focus();
    }
  }

  isRequired(nome: string): boolean {
    const control = this.form.checkoutForm.get(nome);
    if (!control) return false;

    const isTouched = control.touched;
    const hasRequiredError = control.errors?.['required'];
    const hasCpfCnpjError = (nome === 'cpfCnpj') &&
      (control.errors?.['cpfInvalido'] || control.errors?.['cnpjInvalido']);
    const hasCartaoError = (nome === 'cardNumber') && control.errors?.['cartaoInvalido'];
    const hasCepError = (nome === 'cep') && control.errors?.['cepInvalido'];

    return (hasRequiredError && isTouched) || hasCpfCnpjError || hasCartaoError || hasCepError;
  }



  isRequiredNext(): boolean {
    const controls = this.form?.checkoutForm?.controls;

    if (!controls) return false;

    const isValid =
      controls['NomeCompleto']?.valid &&
      controls['cpfCnpj']?.valid &&
      controls['phone']?.valid;

    return isValid;
  }



  isRequiredFinalizar(): boolean {
    const get = (field: string) => this.form.checkoutForm.get(field)?.valid;

    const dadosCliente = [
      'NomeCompleto',
      'cpfCnpj',
      'phone',
      'cep',
      'estado',
      'cidade',
      'bairro',
      'rua',
      'numeroEndereco',
    ];

    const dadosCartao = [
      'cardNumber',
      'mes',
      'ano',
      'cvv'
    ];

    // Se for pagamento via PIX, só valida Nome e CPF/CNPJ
    if (this.activeTab === 'pix') {
      return dadosCliente.every(get);
    }

    // Para pagamento com cartão, valida Nome, CPF/CNPJ e dados do cartão
    return [...dadosCliente, ...dadosCartao].every(get);
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenWidth();
  }

  private checkScreenWidth() {
    if (isPlatformBrowser(this.platformId)) {
      this.isSmallScreen = window.innerWidth <= 1024;
    }
  }

  selecionar(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const opcao = target.value as 'cpf' | 'cnpj';
    this.selected = opcao;

    this.cpfCnpjMask = opcao === 'cnpj' ? '00.000.000/0000-00' : '000.000.000-00';
    this.form.checkoutForm.get('cpfCnpj')?.reset(); // opcional: limpa campo ao mudar
  }

  bandeira: string = '';
  identificarBandeira(numero: string): string {
    numero = numero.replace(/\D/g, '');

    const bandeiras: { [key: string]: RegExp } = {
      visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
      master: /^5[1-5][0-9]{14}$/,
      amex: /^3[47][0-9]{13}$/,
      elo: /^(4011|4312|4389|4514|4576|5041|6277|6362|650|6516|6550)/,
      hipercard: /^(38|60)/,
    };

    for (const bandeira in bandeiras) {
      if (bandeiras[bandeira].test(numero)) {
        return bandeira;
      }
    }

    return '';
  }

  onInputCardNumber(event: Event): void {
    const value = (event.target as HTMLInputElement).value || '';
    this.bandeira = this.identificarBandeira(value);
  }

  buscarEnderecoPorCep(cep: string) {
    const sanitizedCep = cep.replace(/\D/g, '');
    this.cepApi.consultarCep(sanitizedCep).subscribe((res: any) => {
      if (!res.erro) {
        this.form.checkoutForm.patchValue({
          estado: res.state,
          cidade: res.city,
          bairro: res.neighborhood,
          rua: res.street
        });
      }
    });
  }

  select<T>(nome: string) {
    const data = this.form.checkoutForm?.get(nome);
    if (!data) {
      throw new Error('Nome inválido!!!');
    }
    return data as FormControl;
  }

  paymentData(): paymentAsaas {

    const data: paymentAsaas = {
      "paymentMethodId": this.activeTab,
      "name": this.select("NomeCompleto").value || '',
      "cpfCnpj": this.select("cpfCnpj").value,
      "email": this.authUser.getSub(),
      "phone": this.select("phone").value,
      "postalCode": this.select("cep").value,
      "addressNumber": this.select("numeroEndereco").value,

      "addressComplement": `${this.select("rua").value}, ${this.select("numeroEndereco").value}, ${this.select("bairro").value}, ${this.select("cidade").value}, ${this.select("estado").value}, ${this.select("cep").value}`,

      "creditCardNumber": this.select("cardNumber").value,
      "creditCardExpiryMonth": this.select("mes").value,
      "creditCardExpiryYear": this.select("ano").value,
      "creditCardCcv": this.select("cvv").value,
      "value": this.planoSelecionado.price,
      //"installments": this.select("installments").value,
      //"ipClient": this.ipClient,
      "itens": [{
        "id": this.planoSelecionado.planoId,
        "title": this.planoSelecionado.title,
        "description": this.planoSelecionado.subDescricaoPermition,
        "quantity": 1,
        "price": this.planoSelecionado.price
      }]
    }
    return data;
  }


  finalizarPagamento() {
    switch (this.activeTab) {
      case 'credito':
        this.pagarCredito();
        break;
      case 'debito':
        this.pagarDebito();
        break;
      case 'pix':
        this.pagarPix();
        break;
      default:
        console.warn('Método de pagamento não selecionado.');
    }
  }

  pagarCredito() {
    console.log(this.paymentData())
    this.payment.paymentAsaas(this.paymentData()).subscribe({
      next: (res) => {
        this.form.checkoutForm.reset();

        if (res.status === true) {
          this.activeRoute.activeLoading();
          setTimeout(() => {
            this.router.navigateByUrl('/loading', { skipLocationChange: true }).then(() => {
              setTimeout(() => {
                this.router.navigate(['/planos/loadingPayment'], { skipLocationChange: true });
              }, 1000);
            });
          }, 0);

          // Conecta ao WebSocket (só se ainda não conectado)
          if (!this.pagamentoSub) {
            this.socketService.socketWeb(this.authUser.getSub());
            this.pagamentoSub = this.socketService.pagamento$.subscribe((pagamento) => {
              console.log('Pagamento confirmado via WebSocket:', pagamento);

              this.response = pagamento;

              // Redireciona após confirmação de pagamento
              setTimeout(() => {
                this.router.navigateByUrl('/loading', { skipLocationChange: true }).then(() => {
                  setTimeout(() => {
                    this.router.navigate(['/planos/pos-checkout'], { skipLocationChange: true }).then(() => {
                      // 🛑 Aqui desativa o WebSocket depois do redirecionamento final
                      this.socketService.desconectar();

                      // 👇 remove também a inscrição do Observable
                      this.pagamentoSub?.unsubscribe();
                      this.pagamentoSub = undefined; // <- Corrige erro de tipo
                    });
                  }, 1000);
                });
              }, 0);
            });
          }



        } else {
          this.snack.openSnackBar(
            `❌ Pagamento rejeitado.\nVerifique se todas as informações estão corretas.\nMensagem: ${res.status || 'Erro desconhecido.'}`
          );
          console.log(res)
        }
      }
    });

  }


  pagarDebito() {
    console.log('Processando pagamento com cartão de débito...');
    // Aqui você pode validar o formulário e enviar os dados
  }

  pagarPix() {
    this.spinner = true;
    this.ativo = false;
    this.payment.paymentAsaas(this.paymentData()).subscribe((e: any) => {
      console.log(e);
      const msg: any = JSON.stringify(e);
      this.spinner = false;
      this.response = e;
      this.ativo = true;
      this.form.checkoutForm.reset();


      // Conecta ao WebSocket (só se ainda não conectado)
      if (!this.pagamentoSub) {
        this.socketService.socketWeb(this.authUser.getSub());
        this.pagamentoSub = this.socketService.pagamento$.subscribe((pagamento) => {
          console.log('Pagamento confirmado via WebSocket:', pagamento);

          this.spinner = true;
          this.ativo = false;
          this.response = pagamento;

          // Redireciona após confirmação de pagamento
          setTimeout(() => {
            this.router.navigateByUrl('/loading', { skipLocationChange: true }).then(() => {
              setTimeout(() => {
                this.router.navigate(['/planos/pos-checkout'], { skipLocationChange: true }).then(() => {
                  // 🛑 Aqui desativa o WebSocket depois do redirecionamento final
                  this.socketService.desconectar();

                  // 👇 remove também a inscrição do Observable
                  this.pagamentoSub?.unsubscribe();
                  this.pagamentoSub = undefined; // <- Corrige erro de tipo
                });
              }, 1000);
            });
          }, 0);
        });
      }


    });
    this.ativaModal();
    console.log(this.paymentData());
  }




}

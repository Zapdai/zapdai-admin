import { AfterViewInit, Component, HostListener, Inject, Input, OnInit, PLATFORM_ID, ViewChild, ViewEncapsulation } from '@angular/core';
import { PageContainerComponent } from "../../../../shared/component/page-container/page-container.component";
import { MatListModule } from '@angular/material/list';
import { AsideComponent } from '../../../../shared/component/aside-modal/aside-modal.component';
import { MatInputModule } from '@angular/material/input';
import { CheckoutFormService } from '../../../../services/checkoutForm/checkoutForm.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Pagamento } from '../../../../shared/core/types/pagamento';
import { apiPaymentsService } from '../../../../services/checkoutForm/apiPayments.service';
import { PixPaymentRespons } from '../../../../shared/core/types/paymentPagamentopix';
import { CheckoutPixComponent } from '../../../../shared/component/checkout/checkoutPix.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { loadingService } from '../../../../services/loading/loading.service';
import { PopoverModule, Popover } from 'primeng/popover';
import { ButtonModule } from 'primeng/button';
import { itens, itensPlanos } from '../../../../shared/core/Plano/planosItens';
import { PlanoService } from '../../../../services/routesApiZapdai/planos.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackService } from '../../../../services/snackBar/snack.service';
import { AuthService } from '../../../../services/auth.service';
import { Subscription } from 'rxjs';
import { ConfirmPagamentoSocketComponent } from '../../../../services/pagamentosService/pagamentos.service';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';
import { isPlatformBrowser } from '@angular/common';
import { AuthDecodeService } from '../../../../services/AuthUser.service';



@Component({
  selector: 'app-checkoutPlanos02',
  standalone: true,
  imports: [
    PageContainerComponent,
    MatListModule,
    AsideComponent,
    CheckoutPixComponent,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    PopoverModule, ButtonModule,
    MatSnackBarModule,

  ],
  templateUrl: './checkoutPlanos04.component.html',
  styleUrls: ['./checkoutPlanos04.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CheckoutPlanos04Component implements OnInit, AfterViewInit {
  spinner = false;
  response!: PixPaymentRespons;
  pagamentoData: any;
  isSmallScreen: boolean = false;
  datas!: any;
  event: any;
  cardFormInstance: any = null;
  pollingSub!: Subscription;
  pagamentoSub?: Subscription | null;

  stripe: Stripe | null = null;
  card: StripeCardElement | null = null;
  isCardComplete = false;
  cardError: string | null = null;


  constructor(public form: CheckoutFormService,
    public payment: apiPaymentsService,
    private rota: ActivatedRoute,
    private router: Router,
    private activeRoute: loadingService,
    public apiPlanosService: PlanoService,
    private snack: SnackService,
    private authService: AuthService,
    private socketService: ConfirmPagamentoSocketComponent,
    private authUser:AuthDecodeService,
    @Inject(PLATFORM_ID) private platformId: Object) {

  }

  ngOnInit(): void {

    const navigation = this.router.getCurrentNavigation();
    this.datas = navigation?.extras?.state?.['data'];

    if (this.datas) {
      console.log('Dados recebidos:', this.datas);
    } else {
      console.warn('Nenhum dado disponível na navegação.');

      if (isPlatformBrowser(this.platformId)) {
        const saved = localStorage.getItem('checkoutData');
        if (saved) {
          this.datas = JSON.parse(saved);
          console.log('Dados restaurados do localStorage:', this.datas);
        }
      }
    }

    this.checkScreenWidth();

    this.apiPlanosService.planosConsumoApi().subscribe(response => {
      this.itensPlanos = response.planos.filter((plano: any) => plano.price > 0);
    });

    this.rota.queryParams.subscribe(params => {
      const rawData = params['data'];
      this.event = rawData ? JSON.parse(rawData) : null;
    });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      loadStripe('pk_test_51RQgFR4RAOlrIVW4NGeFGRUQOKFUUTSgmzicyM8h60iDMmFjFLlodlc1LPZmdgWiGiQ0LcEa6TZRGZpwVXM9Ufl700pUQKzRZd')
        .then(stripe => {
          if (!stripe) {
            console.error('Falha ao carregar Stripe');
            return;
          }

          this.stripe = stripe;
          const elements = this.stripe.elements();
          this.card = elements.create('card');
          this.card.mount('#card-element');

          this.card.on('change', (event) => {
            this.isCardComplete = event.complete;
            if (event.error) {
              this.cardError = event.error.message;
            } else {
              this.cardError = null;
            }
          });
        });
    }
  }


  img = "/banners/banner-checkout01.png";
  ativo = false;
  activeTab: 'credito' | 'debito' | 'pix' = 'credito';
  selected: 'cpf' | 'cnpj' = 'cpf';
  NomeCompleto: string = '';
  primeiroNome: string = '';
  sobrenome: string = '';

  // Método para trocar aba
  setTab(novoTab: 'credito' | 'debito' | 'pix') {
    if (this.activeTab !== novoTab) {
      this.activeTab = novoTab;
    }
  }


  @ViewChild('op') op!: Popover;

  selectedPlano: itens | null = null;
  itensPlanos: itens[] = [];
  showPopover = false;

  togglePopover(event: MouseEvent) {
    event.stopPropagation();
    this.showPopover = !this.showPopover;
  }

  closePopover() {
    this.showPopover = false;
  }

  selectPlano(plano: any) {
    this.selectedPlano = plano;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    this.showPopover = false;
  }


  ativaModal() {
    this.ativo = false;
  }

  mudaCompo(event: any) {
    if (event) {
      event.focus();
    }
  }

  isRequired(nome: string) {
    return this.form.checkoutForm.get(nome)?.errors?.["required"] && this.form.checkoutForm.get(nome)?.touched;
  }

  isRequiredNext(): boolean {
    const controls = this.form?.checkoutForm?.controls;

    if (!controls) return false;

    const isValid =
      controls['NomeCompleto']?.valid &&
      controls['email']?.valid &&
      controls['cpfCnpj']?.valid;

    return isValid;
  }



  isRequiredFinalizar() {
    const NomeCompleto = this.form.checkoutForm.get('NomeCompleto')?.valid;
    const email = this.form.checkoutForm.get('email')?.valid;
    const cpfCnpj = this.form.checkoutForm.get('cpfCnpj')?.valid;

    const camposBasicosValidos = !!(NomeCompleto && email && cpfCnpj);

    if (this.activeTab === 'pix') {
      return camposBasicosValidos;
    }

    // Para cartão
    return camposBasicosValidos && this.isCardComplete;
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
    const opcao = target.value as 'cpf' | 'cnpj'; // forçando o tipo correto
    this.selected = opcao;
  }

  async handlePayment(event: Event) {
    event.preventDefault();

    if (!this.stripe || !this.card) {
      console.error('Stripe.js não carregado corretamente.');
      return;
    }

    const { token, error } = await this.stripe.createToken(this.card);

    if (error) {
      console.error('Erro ao gerar token do cartão:', error.message);
      this.snack.error('Erro ao processar cartão. Verifique os dados.');
      return;
    }

    if (token) {
      console.log('Token gerado:', token);
      const paymentData = this.data();
      paymentData.token = token.id;

      this.pagarCredito(paymentData);
    }
  }



  select<T>(nome: string) {
    const data = this.form.checkoutForm?.get(nome);
    if (!data) {
      throw new Error('Nome inválido!!!');
    }
    return data as FormControl;
  }

  data(): Pagamento {
    const nomeCompleto = this.select("NomeCompleto").value || '';
    const partes = nomeCompleto.trim().split(' ');
    const primeiroNome = partes[0] || '';
    const sobrenome = partes.slice(1).join(' ') || '';

    const data: Pagamento = {
      "paymentMethodId": this.activeTab,
      "transactionAmount": this.selectedPlano?.price || this.event.price,
      "description": this.selectedPlano?.title ?? this.event.title,
      "payer": {
        "email": this.authUser.getSub(),
        "first_name": primeiroNome,
        "last_name": sobrenome,
        "identification": {
          "number": this.select("cpfCnpj").value,
          "type": this.selected
        }
      },
      "itens": [{
        "id": this.selectedPlano?.planoId ?? this.event.planoId,
        "title": this.selectedPlano?.title ?? this.event.title,
        "description": this.selectedPlano?.subDescricaoPermition ?? this.event.subDescricaoPermition,
        "quantity": 1,
        "price": this.selectedPlano?.price || this.event.price
      }]
    };
    return data;
  }


  finalizarPagamento() {
    switch (this.activeTab) {
      case 'credito':
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

  pagarCredito(formData: any) {
    const nomeCompleto = this.select("NomeCompleto").value || '';
    const partes = nomeCompleto.trim().split(' ');
    const primeiroNome = partes[0] || '';
    const sobrenome = partes.slice(1).join(' ') || '';

    if (!formData.token) {
      console.error('Token não gerado. Verifique os dados do cartão.', formData);
      return;
    }

    const paymentData = {
      token: formData.token,
      issuerId: formData.issuerId,
      paymentMethodId: formData.paymentMethodId,
      transactionAmount: String(this.selectedPlano?.price || this.event.price),
      installments: formData.installments,
      description: this.selectedPlano?.title ?? 'Plano Zapdai',
      payer: {
        email: this.authUser.getSub(),
        first_name: primeiroNome,
        last_name: sobrenome,
        identification: {
          type: this.selected,
          number: this.select("cpfCnpj").value,
        }
      },
      itens: [{
        id: this.selectedPlano?.planoId ?? this.event.planoId,
        title: this.selectedPlano?.title ?? this.event.title,
        description: this.selectedPlano?.subDescricaoPermition ?? this.event.subDescricaoPermition,
        quantity: 1,
        price: this.selectedPlano?.price || this.event.price
      }]
    };

    console.log(paymentData)


  }


  pagarDebito() {
    console.log('Processando pagamento com cartão de débito...');
    // Aqui você pode validar o formulário e enviar os dados
  }

  pagarPix() {
    this.spinner = true;
    this.ativo = false;
    this.payment.pagamentoPix(this.data()).subscribe((e: any) => {
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
    console.log(this.data());
  }




}

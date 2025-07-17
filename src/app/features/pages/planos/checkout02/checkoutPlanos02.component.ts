import { AfterViewInit, Component, HostListener, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { AsideComponent } from '../../../../shared/component/aside-modal/aside-modal.component';
import { MatInputModule } from '@angular/material/input';
import { CheckoutFormService } from '../../../../services/checkoutForm/checkoutForm.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';
import { MatIconModule } from '@angular/material/icon';
import { Pagamento } from '../../../../shared/core/types/pagamento';
import { apiPaymentsService } from '../../../../services/checkoutForm/apiPayments.service';
import { PixPaymentRespons } from '../../../../shared/core/types/paymentPagamentopix';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { loadingService } from '../../../../services/loading/loading.service';
import { PopoverModule, Popover } from 'primeng/popover';
import { ButtonModule } from 'primeng/button';
import { itens } from '../../../../shared/core/Plano/planosItens';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackService } from '../../../../services/snackBar/snack.service';
import { Subscription } from 'rxjs';
import { ConfirmPagamentoSocketComponent } from '../../../../services/pagamentosService/pagamentos.service';
import { AuthDecodeService } from '../../../../services/AuthUser.service';



declare var MercadoPago: any;

@Component({
  selector: 'app-checkoutPlanos02',
  standalone: true,
  imports: [
    MatListModule,
    AsideComponent,
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
  templateUrl: './checkoutPlanos02.component.html',
  styleUrls: ['./checkoutPlanos02.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CheckoutPlanos02Component implements AfterViewInit, OnInit {
  spinner = false;
  response!: PixPaymentRespons;
  pagamentoData: any;
  isSmallScreen: boolean = false;
  datas!: any;
  event: any;
  cardFormInstance: any = null;
  emailUser: string = ''
  pollingSub!: Subscription;
  pagamentoSub?: Subscription | null;

  constructor(public form: CheckoutFormService,
    public payment: apiPaymentsService,
    private rota: ActivatedRoute,
    private router: Router,
    private activeRoute: loadingService,
    private snack: SnackService,
    private authService: AuthDecodeService,
    private socketService: ConfirmPagamentoSocketComponent) {

  }

  ngOnInit(): void {
    this.emailUser = this.authService.getSub();

    const navigation = this.router.getCurrentNavigation();
    this.datas = navigation?.extras?.state?.['data'];
    if (this.datas) {
      console.log('Dados recebidos:', this.data);
    } else {
      console.warn('Nenhum dado disponível na navegação.');
      // fallback opcional
      const saved = localStorage.getItem('checkoutData');
      if (saved) {
        this.data = JSON.parse(saved);
        console.log('Dados restaurados do localStorage:', this.data);
      }
    }


    this.checkScreenWidth();

    this.rota.queryParams.subscribe(params => {
      const rawData = params['data'];
      this.event = rawData ? JSON.parse(rawData) : null;
    });

  }


  img = "/banners/banner-checkout01.png";
  ativo = false;
  activeTab: 'credito' | 'debito' | 'pix' = 'credito';
  selected: 'cpf' | 'cnpj' = 'cpf';
  NomeCompleto: string = '';
  primeiroNome: string = '';
  sobrenome: string = '';


  ngAfterViewInit(): void {
    // Se quiser garantir o carregamento aqui também:
    if (this.event.price) {
      this.iniciarMercadoPago();
    }
  }

  iniciarMercadoPago(): void {
    const mp = new MercadoPago(environment.PublicKey_MercadoPago);

    // Desmontar se existir
    this.desmontarMercadoPago()
    setTimeout(() => {
      this.cardFormInstance = mp.cardForm({
        amount: String(this.selectedPlano?.price || this.event.price),
        form: {
          id: 'form-checkout',
          cardholderName: { id: 'form-checkout__cardholderName', placeholder: 'Nome no cartão' },
          cardholderEmail: { id: 'form-checkout__cardholderEmail', placeholder: 'E-mail' },
          cardNumber: { id: 'form-checkout__cardNumber', placeholder: 'Número do cartão' },
          expirationMonth: { id: 'form-checkout__expirationMonth', placeholder: 'MM' },
          expirationYear: { id: 'form-checkout__expirationYear', placeholder: 'AAAA' },
          securityCode: { id: 'form-checkout__securityCode', placeholder: 'CVV' },
          installments: { id: 'form-checkout__installments', placeholder: 'Parcelas' },
          issuer: { id: 'form-checkout__issuer', placeholder: 'Banco emissor' },
          identificationType: { id: 'form-checkout__identificationType', placeholder: 'Tipo de documento' },
          identificationNumber: { id: 'form-checkout__identificationNumber', placeholder: 'CPF ou CNPJ' }

        },
        callbacks: {
          onFormMounted: function (error: any) {
            if (error) {
              console.warn('Erro ao montar o form:', error);
              return;
            }
            console.log("Form montado com sucesso");
          },
          onSubmit: (event: any) => {
            event.preventDefault();
            const formData = this.cardFormInstance.getCardFormData();

            this.pagarCredito(formData)
            console.log(formData)

          }
        }
      });
    }, 1000);
  }

  desmontarMercadoPago() {
    if (this.cardFormInstance && typeof this.cardFormInstance.unmount === 'function') {
      this.cardFormInstance.unmount();
      this.cardFormInstance = null;
    }
  }


  // Método para trocar aba
  setTab(novoTab: 'credito' | 'debito' | 'pix') {
    if (this.activeTab !== novoTab) {
      this.activeTab = novoTab;

      // Se quiser garantir desmonta ao trocar
      this.desmontarMercadoPago();
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
    this.iniciarMercadoPago();
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

    if (this.activeTab === 'pix') {
      return !!(NomeCompleto && email && cpfCnpj);
    }

    const cardNumber = this.form.checkoutForm.get('cardNumber')?.valid;
    const mes = this.form.checkoutForm.get('mes')?.valid;
    const ano = this.form.checkoutForm.get('ano')?.valid;
    const cvv = this.form.checkoutForm.get('cvv')?.valid;

    return !!(NomeCompleto && email && cpfCnpj && cardNumber && mes && ano && cvv);
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenWidth();
  }

  private checkScreenWidth() {
    this.isSmallScreen = window.innerWidth <= 1024;
  }

  selecionar(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const opcao = target.value as 'cpf' | 'cnpj'; // forçando o tipo correto
    this.selected = opcao;
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
        "email": this.emailUser,
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
        email: this.emailUser,
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

    /// Realizando pagamento CARTÃO DE CRÉDITO
    this.payment.pagarComCartao(paymentData).subscribe({
      next: (res) => {
        this.form.checkoutForm.reset();

        if (res.status === 'approved') {
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
            this.socketService.socketWeb(this.emailUser);
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
      },
      error: (err) => {
        console.error('Erro ao processar pagamento:', err);

        const mensagemErro = err?.error?.message || 'Erro ao processar o pagamento.';
        const detalhes = err?.error?.cause?.[0]?.code || '';

        this.snack.openSnackBar(
          `❌ Falha ao processar pagamento.\n${mensagemErro}${detalhes ? `\nCódigo: ${detalhes}` : ''}`
        );
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
    this.payment.pagamentoPix(this.data()).subscribe((e: any) => {
      const msg: any = JSON.stringify(e);
      this.spinner = false;
      this.response = e;
      this.ativo = true;
      this.form.checkoutForm.reset();


      // Conecta ao WebSocket (só se ainda não conectado)
      if (!this.pagamentoSub) {
        this.socketService.socketWeb(this.emailUser);
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

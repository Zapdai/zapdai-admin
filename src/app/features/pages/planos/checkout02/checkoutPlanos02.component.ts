import { AfterViewInit, Component, HostListener, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { PageContainerComponent } from "../../../../shared/component/page-container/page-container.component";
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
import { CheckoutPixComponent } from '../../../../shared/component/checkout/checkoutPix.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { loadingService } from '../../../../services/loading/loading.service';
import { PopoverModule, Popover } from 'primeng/popover';
import { ButtonModule } from 'primeng/button';
import { itens, itensPlanos } from '../../../../shared/core/Plano/planosItens';
import { PlanoService } from '../../../../services/planosServices/planos.service';


declare var MercadoPago: any;

@Component({
  selector: 'app-checkoutPlanos02',
  imports: [
    PageContainerComponent,
    MatListModule,
    AsideComponent,
    CheckoutPixComponent,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    NgxMaskDirective,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    PopoverModule, Popover, ButtonModule,
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

  constructor(public form: CheckoutFormService, public payment: apiPaymentsService, private rota: ActivatedRoute, private router: Router, private activeRoute: loadingService, public apiPlanosService: PlanoService) {

  }

  ngOnInit(): void {
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

    this.apiPlanosService.planosConsumoApi().subscribe(response => {
      this.itensPlanos = response.planos;
    });

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
        issuer: { id: 'form-checkout__issuer', placeholder: 'Banco emissor' }
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

        }
      }
    });
  }

  desmontarMercadoPago() {
    if (this.cardFormInstance && typeof this.cardFormInstance.unmount === 'function') {
      this.cardFormInstance.unmount();
      this.cardFormInstance = null;
      console.log('Formulário Mercado Pago desmontado');
    }
  }

  // Aqui é o método do ciclo de vida
  ngAfterViewChecked(): void {
    // Só monta se estiver na aba crédito e o form ainda não estiver montado
    if (this.activeTab === 'credito' && !this.cardFormInstance) {
      this.iniciarMercadoPago();
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
      "transactionAmount": this.selectedPlano?.price ?? 0,
      "description": this.selectedPlano?.title ?? 'Plano Zapdai',
      "payer": {
        "email": this.select("email").value,
        "first_name": primeiroNome,
        "last_name": sobrenome,
        "identification": {
          "number": this.select("cpfCnpj").value,
          "type": this.selected
        }
      },
      "itens": [{
        "id": 2,
        "title": this.selectedPlano?.title ?? '',
        "description": this.selectedPlano?.subDescricaoPermition ?? '',
        "quantity": 1,
        "price": this.selectedPlano?.price ?? 0
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
        email: formData.cardholderEmail,
        first_name: primeiroNome,
        last_name: sobrenome,
        identification: {
          type: this.selected,
          number: this.select("cpfCnpj").value,
        }
      },
      itens: [{
        id: 2,
        title: this.selectedPlano?.title ?? '',
        description: this.selectedPlano?.subDescricaoPermition ?? '',
        quantity: 1,
        price: this.selectedPlano?.price ?? 0
      }]
    };
    this.payment.pagarComCartao(paymentData).subscribe((res) => {
      console.log('Pagamento processado com sucesso:', res);
      console.log(paymentData)
      if (res.status === 'approved') {
        this.activeRoute.activeLoading()
        setTimeout(() => {
          this.router.navigateByUrl('/loading', { skipLocationChange: true }).then(() => {
            setTimeout(() => {
              this.router.navigate(['/planos/pos-checkout'])
            }, 1000);
          })
        }, 0);
      } else {
        console.log("Pagamento Rejeitado")
      }
    }
    );
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
    });
    this.ativaModal();
    console.log(this.data());
  }


}

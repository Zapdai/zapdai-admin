import { AfterViewInit, Component, OnInit } from '@angular/core';
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
    MatProgressSpinnerModule
  ],
  templateUrl: './checkoutPlanos02.component.html',
  styleUrls: ['./checkoutPlanos02.component.scss']
})
export class CheckoutPlanos02Component implements AfterViewInit{
  spinner = false;
  response!: PixPaymentRespons;
  cardFormInstance: any;
  pagamentoData: any;
  constructor(public form: CheckoutFormService, public payment: apiPaymentsService) {}


  img = "/banners/banner-checkout01.png";
  ativo = false;
  activeTab: 'credito' | 'debito' | 'pix' = 'credito';
  selected: 'cpf' | 'cnpj' = 'cpf';
  NomeCompleto: string = '';
  primeiroNome: string = '';
  sobrenome: string = '';


  ngAfterViewInit() {
    setTimeout(() => {
      const mp = new MercadoPago(environment.PublicKey_MercadoPago);
  
      this.cardFormInstance = mp.cardForm({
        amount: '1',
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
            if (!formData.token) {
              console.error("Token não gerado. Verifique os dados do cartão.", formData);
            } else {
              console.log("Token gerado com sucesso:", formData);
              this.pagarCredito(formData)
            }
          }
        }
      });
    }, 1000);
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

  selecionar(opcao: 'cpf' | 'cnpj') {
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
      "transactionAmount": 1,
      "description": "Plano Pleno - Zapdai",
      "payer": {
        "email": this.select("email").value,
        "first_name": primeiroNome,
        "last_name": sobrenome,
        "identification": {
          "number": this.select("cpfCnpj").value,
          "type": this.selected
        }
      }
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
  
    const token = formData.token;
    const issuerId = formData.issuerId;
    const payment_method_id = formData.paymentMethodId;
    const email = formData.cardholderEmail;
    const amount = 1;
  
    if (!token) {
      console.error('Token não gerado. Verifique os dados do cartão.', formData);
      return;
    }
  
    const paymentData = {
      token: token,
      issuerId: issuerId,
      payment_method_id: payment_method_id,
      transaction_amount: formData.amount,
      installments: formData.installments,
      description: "Plano Pleno - Zapdai",
      payer: {
        email: email,
        identification: {
          type: this.selected,
          number: this.select("cpfCnpj").value,
        },
        "itens": {
          "id": 2,
          "title": "Plano Pleno",
          "description": "Plano Pleno - Zapdai",
          "quantity": 1,
          "price": 1
        }
      },
    };
    console.log(paymentData);
    // Chamada para a sua API backend para processar o pagamento
    this.payment.pagarComCartao(paymentData).subscribe((res) => {
        console.log('Pagamento processado com sucesso:', res);
        // Aqui você pode redirecionar, exibir confirmação etc.
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

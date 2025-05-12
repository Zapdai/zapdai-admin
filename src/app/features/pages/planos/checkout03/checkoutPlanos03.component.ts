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
  templateUrl: './checkoutPlanos03.component.html',
  styleUrls: ['./checkoutPlanos03.component.scss']
})
export class CheckoutPlanos03Component implements AfterViewInit{
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

private cardPaymentBrickController: any;
  ngAfterViewInit() {
 const mp = new MercadoPago(environment.PublicKey_MercadoPago, {
    locale: 'pt-BR'
  });

  const bricksBuilder = mp.bricks();
  const onSubmitFn = async (formData: any) => {
    console.log('Dados recebidos no onSubmit:', formData);

    // Aqui você pode enviar para sua API
    const response = await fetch('/api/pagar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    console.log('Resposta da API:', result);

    // O que retornar aqui será mostrado no Brick
    return result;
  };

  bricksBuilder.create("cardPayment", "paymentBrick_container", {
    initialization: {
     amount: '100', // valor do pagamento
    },
    form: {
          id: 'form-checkout',
    },
    customization: {
      visual: {
         hidePaymentButton: true,
        style: {
          theme: "default",
        }
      }
    },
    callbacks: {
      onReady: () => {
         const form = document.getElementById('form-checkout') as HTMLFormElement;

        form?.addEventListener('submit', async (event) => {
          event.preventDefault();

          try {
            // Esse é o "jeitinho" que funciona: acessar o Brick diretamente no DOM e chamar submit()
            const brickContainer = document.getElementById('paymentBrick_container');
            const submitEvent = new CustomEvent('brick::submit', {
              bubbles: true,
              cancelable: true,
            });
            brickContainer?.dispatchEvent(submitEvent);
          } catch (error) {
            console.error('Erro ao enviar pagamento:', error);
          }
        });
      },
      onSubmit: onSubmitFn,
      
      onError: (error: any) => {
        console.error("Erro:", error);
      }
    }
  }).then((controller:any) => {
    this.cardPaymentBrickController = controller;
  });
}
              // const formData = this.cardFormInstance.getCardFormData();

   alerts(){
    alert("deu")
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

    if (!formData.token) {
      console.error('Token não gerado. Verifique os dados do cartão.', formData);
      return;
    }
  
    const paymentData = {
      token: formData.token,
      issuerId: formData.issuerId,
      paymentMethodId: formData.paymentMethodId,
      transactionAmount: formData.amount,
      installments: formData.installments,
      description: "Plano Pleno - Zapdai",
      payer: {
        email: formData.cardholderEmail,
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

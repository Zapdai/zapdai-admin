import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, Output, OnInit, AfterViewInit } from '@angular/core';
import { Console } from 'console';
import { apiPaymentsService } from '../../../../services/checkoutForm/apiPayments.service';
import { Pagamento } from '../../../core/types/pagamento';
import { FormControl } from '@angular/forms';
import { CheckoutFormService } from '../../../../services/checkoutForm/checkoutForm.service';
import { PixPaymentRespons } from '../../../core/types/paymentPagamentopix';

declare var MercadoPago: any;

@Component({
  selector: 'app-mercadopago',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mercadopago.component.html',
  styleUrl: './mercadopago.component.scss'
})
export class MercadopagoComponent implements OnDestroy  {
constructor(public payment: apiPaymentsService,public form: CheckoutFormService){}
bt:any;
@Output() dataEmite = new EventEmitter()

ngAfterViewInit(): void {
  if(this.bt){
    this.bt.destroy()
  }
  const mp = new MercadoPago('APP_USR-8bcff43a-21c1-465b-86b5-066af2ef1efe', {
    locale: 'pt-BR',
  });
  mp.bricks().create('payment', 'payment-brick-container', {
    initialization: {
      amount: 100,
    },
    customization: {
      paymentMethods: {
        ticket: 'all',
        bankTransfer: ['pix'],
        creditCard: 'all',
        debitCard: 'all',
      },
      visual: {
        hidePaymentButton: false,
        style: {
          theme: 'default'
        }
      },
    },
    renderMode: 'auto',
    callbacks: {
      onReady: () => {
      },
      onSubmit: async (data: any) => {
       this.finalizarPagamento(data)
      },
      onError: (error: any) => {
      }
    }
  }).then((brick: any) => {
    this.bt = brick;
  });
}

spinner = false;
  response!: PixPaymentRespons;
  img = "/banners/banner-checkout01.png"
  ativo = true
  activeTab: 'credito' | 'pix' | "" = 'credito';
  selected: 'cpf' | 'cnpj' = 'cpf';
  NomeCompleto: string = '';
  primeiroNome: string = '';

  selecionar(opcao: 'cpf' | 'cnpj') {
    this.selected = opcao;
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  select<T>(nome: string) {
    const data = this.form.checkoutForm?.get(nome)

    if (!data) {
      throw new Error('Nome inválido!!!')
    }
    return data as FormControl
  }
  data(): Pagamento {
    const nomeCompleto = this.select("NomeCompleto").value || '';
    const partes = nomeCompleto.trim().split(' ');
    const primeiroNome = partes[0] || '';
    const sobrenome = partes.slice(1).join(' ') || '';

    const data: Pagamento = {
      "paymentMethodId": this.activeTab,
      "transactionAmount": 1.00,
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
    }
    return data;
  }
 


  ativaModal() {
    this.spinner = false
  }
 finalizarPagamento(event: any) {
  console.log('RESPONSE data =>', this.data);
   this.dataEmite.emit()
    new Promise(() => {
      const itens: any = event.formData
      let tab = itens.payment_method_id;
      this.payment.pagamentoPix(this.data()).subscribe((e: any) => {
        console.log('RESPONSE PIX =>',e);

      })
    })

  }

}


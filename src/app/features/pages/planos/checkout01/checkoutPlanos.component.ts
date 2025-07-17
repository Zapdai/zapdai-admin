import { Component } from '@angular/core';
import {MatListModule} from '@angular/material/list';
import { AsideComponent } from '../../../../shared/component/aside-modal/aside-modal.component';
import {MatInputModule} from '@angular/material/input';
import { CheckoutFormService } from '../../../../services/checkoutForm/checkoutForm.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';
import { MatIconModule } from '@angular/material/icon';
import { Pagamento } from '../../../../shared/core/types/pagamento';
import { apiPaymentsService } from '../../../../services/checkoutForm/apiPayments.service';
import { PixPaymentRespons } from '../../../../shared/core/types/paymentPagamentopix';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { PaymentMPComponent } from "../../../../shared/component/paymentMP/paymentMP.component";


@Component({
  selector: 'app-checkoutPlanos',
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
    PaymentMPComponent
],
  templateUrl: './checkoutPlanos.component.html',
  styleUrl: './checkoutPlanos.component.scss'
})
export class checkoutPlanosComponent {
  spinner = false;
  response!:PixPaymentRespons;
  mercadoPago: any;

  constructor( public form: CheckoutFormService, public payment: apiPaymentsService){}
 
  img = "/banners/banner-checkout01.png"
  ativo = false;  
  activeTab: 'credito' | 'debito' | 'pix' = 'credito';
  selected: 'cpf' | 'cnpj' = 'cpf';
  NomeCompleto: string = '';
  primeiroNome: string = '';
  sobrenome: string = '';

  ativaModal(){
    this.ativo = false;
  }

  mudaCompo(event:any){
    if(event){
     event.focus()
    }
  }

  isRequired(nome: string){
    return this.form.checkoutForm.get(nome)?.errors?.["required"] && this.form.checkoutForm.get(nome)?.touched
  }


  selecionar(opcao: 'cpf' | 'cnpj') {
    this.selected = opcao;
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
      "payer":{
        "email": this.select("email").value,
        "first_name": primeiroNome,
        "last_name": sobrenome,
        "identification":{
          "number": this.select("cpfCnpj").value,
          "type": this.selected
        }
      }
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
    console.log('Processando pagamento com cartão de crédito...');
  }
  
  pagarDebito() {
    console.log('Processando pagamento com cartão de débito...');
    // aqui você pode validar o formulário e enviar os dados
  }
  
  pagarPix() {
    this.spinner = true;
    this.ativo = false;
    this.payment.pagamentoPix(this.data()).subscribe((e:any)=>{
      const msg: any = JSON.stringify(e)
      this.spinner = false;
      this.response = e;
      this.ativo = true;
    })
    this.ativaModal()
    console.log(this.data())
  }
}
  





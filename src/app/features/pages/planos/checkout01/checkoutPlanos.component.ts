import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PageContainerComponent } from "../../../../shared/component/page-container/page-container.component";
import { footerComponent } from "../../home/foother/footer.component";
import {MatListModule} from '@angular/material/list';
import { AsideComponent } from '../../../../shared/component/aside-modal/aside-modal.component';
import { CheckoutComponent } from '../../../../shared/component/checkout/checkout.component';
import {MatInputModule} from '@angular/material/input';
import { CheckoutFormService } from '../../../../services/checkoutForm/checkoutForm.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';
import { MatIconModule } from '@angular/material/icon';
import { PagamentoPix } from '../../../../shared/core/types/pagamento';
import { apiPaymentsService } from '../../../../services/checkoutForm/apiPayments.service';
import { PixPaymentRespons } from '../../../../shared/core/types/paymentPagamentopix';

@Component({
  selector: 'app-checkoutPlanos',
  imports: [
    PageContainerComponent, 
    MatListModule,
    AsideComponent,
    CheckoutComponent, 
    MatInputModule, 
    ReactiveFormsModule, 
    CommonModule, 
    NgxMaskDirective, 
    FormsModule,
    MatIconModule,
    
  ],
  templateUrl: './checkoutPlanos.component.html',
  styleUrl: './checkoutPlanos.component.scss'
})
export class checkoutPlanosComponent {
  @Output() finalizaPagamentoBtn = new EventEmitter()
  response!:PixPaymentRespons;
  constructor( public form: CheckoutFormService, public payment: apiPaymentsService){}

  img = "/banners/banner-checkout01.png"
  ativo = false;  
  activeTab: 'credito' | 'debito' | 'pix' = 'credito';
  selected: 'cpf' | 'cnpj' = 'cpf';
  NomeCompleto: string = '';
  primeiroNome: string = '';
  sobrenome: string = '';


  ativaModal(){
    this.ativo = !this.ativo;
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
    const data = this.form.checkoutForm?.get(nome)

    if (!data) {
      throw new Error('Nome inválido!!!')
    }
    return data as FormControl
  }



  separarNome(nomeCompleto: string): { primeiroNome: string, sobrenome: string } {
    const partes = nomeCompleto.split(' '); // Divide o nome completo em partes
    const primeiroNome = partes[0]; // O primeiro nome é sempre o primeiro item
    const sobrenome = partes.slice(1).join(' '); // O sobrenome é o restante
  
    return { primeiroNome, sobrenome };
  }


  data(): PagamentoPix {
    const nomeCompleto = this.select("NomeCompleto").value || '';
    const partes = nomeCompleto.trim().split(' ');
    const primeiroNome = partes[0] || '';
    const sobrenome = partes.slice(1).join(' ') || '';

    const data: PagamentoPix = {
      "paymentMethodId": this.activeTab,
      "transactionAmount": 197.00,
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
    // aqui você pode validar o formulário e enviar os dados
  }
  
  pagarDebito() {
    console.log('Processando pagamento com cartão de débito...');
    // aqui você pode validar o formulário e enviar os dados
  }
  
  pagarPix() {
    this.payment.pagamentoPix(this.data()).subscribe((e:any)=>{
      const msg: any = JSON.stringify(e)
      this.response = e;
    })
    console.log(this.data())
  }
}
  





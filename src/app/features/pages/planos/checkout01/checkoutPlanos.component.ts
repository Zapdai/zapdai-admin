import { Component } from '@angular/core';
import { PageContainerComponent } from "../../../../shared/component/page-container/page-container.component";
import { footerComponent } from "../../home/foother/footer.component";
import {MatListModule} from '@angular/material/list';
import { AsideComponent } from '../../../../shared/component/aside-modal/aside-modal.component';
import { CheckoutComponent } from '../../../../shared/component/checkout/checout.component';
import {MatInputModule} from '@angular/material/input';
import { CheckoutFormService } from '../../../../services/checkoutForm/checkoutForm.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-checkoutPlanos',
  imports: [PageContainerComponent, MatListModule,AsideComponent,CheckoutComponent, MatInputModule, ReactiveFormsModule, CommonModule, NgxMaskDirective, FormsModule],
  templateUrl: './checkoutPlanos.component.html',
  styleUrl: './checkoutPlanos.component.scss'
})
export class checkoutPlanosComponent {
  constructor( public form: CheckoutFormService){}

  img = "/banners/banner-checkout01.png"
  ativ = false;

  ativaModal(){
    this.ativ = !this.ativ;
  }

  mudaCompo(event:any){
    if(event){
     event.focus()
    }
  }

  isRequired(nome: string){
    return this.form.checkoutForm.get(nome)?.errors?.["required"] && this.form.checkoutForm.get(nome)?.touched
  }

  selected: 'cpf' | 'cnpj' = 'cpf';
  valor: string = '';

  selecionar(opcao: 'cpf' | 'cnpj') {
    this.selected = opcao;
  }

  save() {
    return this.valor
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
  
  
  

}

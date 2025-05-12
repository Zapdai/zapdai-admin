import {  Component} from '@angular/core';
import { PageContainerComponent } from "../../../../shared/component/page-container/page-container.component";
import { MatListModule } from '@angular/material/list';
import { AsideComponent } from '../../../../shared/component/aside-modal/aside-modal.component';
import { MatInputModule } from '@angular/material/input';
import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CheckoutPixComponent } from '../../../../shared/component/checkout/checkoutPix.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MercadopagoComponent } from '../../../../shared/component/MercadoPagoCheckout/mercadopago/mercadopago.component';
import { MatButtonModule } from '@angular/material/button';
import { formComponentCheckout } from './form/form.component';

declare var MercadoPago: any;

@Component({
  selector: 'app-checkoutPlanos2',
  standalone: true,
  imports: [
    PageContainerComponent,
    MatListModule,
    AsideComponent,
    CheckoutPixComponent,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MercadopagoComponent,
    MatButtonModule,
    formComponentCheckout

  ],
  templateUrl: './checkoutPlanos2.component.html',
  styleUrl: './checkoutPlanos2.component.scss'
})
export class checkoutPlanos {
  response:any;
  ativo = false;
  ativoE(){
      this.ativo = false;
  }
  ativaModal(event:any){
    this.response = event;
    this.ativo = true;
    
  }
}






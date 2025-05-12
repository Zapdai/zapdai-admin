import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { NgxMaskDirective } from "ngx-mask";
import { CheckoutFormService } from "../../../../../services/checkoutForm/checkoutForm.service";
import { ReactiveFormsModule } from "@angular/forms";

@Component({
    selector:"app-form",
    standalone:true,
    imports:[    NgxMaskDirective,CommonModule,ReactiveFormsModule],
    templateUrl:"./form.component.html",
    styleUrl:"./form.component.scss"
})

export class formComponentCheckout{
    selected: 'cpf' | 'cnpj' = 'cpf';
      constructor( public form: CheckoutFormService){}
    
    selecionar(opcao: 'cpf' | 'cnpj') {
        this.selected = opcao;
      }
      isRequired(nome: string){
        return this.form.checkoutForm.get(nome)?.errors?.["required"] && this.form.checkoutForm.get(nome)?.touched
      }
    
    

}
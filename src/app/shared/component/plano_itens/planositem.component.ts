import { Component, EventEmitter, Input, Output } from "@angular/core";
import { itens, itensPlanos } from "../../core/Plano/planosItens";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";

@Component({
    selector:"app-planos-itens",
    standalone:true,
    imports:[CommonModule],
    templateUrl:"./planositem.component.html",
    styleUrl:"./planositem.component.scss"
})

export class PlanosItensComponent{
constructor(private router:Router){}
    @Input() itens?:itens
  @Input() img?:string
   pageCheckout02(event:any){
    this.router.navigate(['/planos/checkout02'], {
         skipLocationChange: false,
         state: { data: event}
         })
  }
    sanitizeDescription(text: any): string {
  return text.replace(/ \/+/g, '').trim();
}
}
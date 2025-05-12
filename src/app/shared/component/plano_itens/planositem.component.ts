import { Component, Input } from "@angular/core";
import { itens, itensPlanos } from "../../core/Plano/planosItens";
import { CommonModule } from "@angular/common";

@Component({
    selector:"app-planos-itens",
    standalone:true,
    imports:[CommonModule],
    templateUrl:"./planositem.component.html",
    styleUrl:"./planositem.component.scss"
})

export class PlanosItensComponent{
    @Input() itens?:itens
    ativaModal(){}
    sanitizeDescription(text: any): string {
  return text.replace(/ \/+/g, '').trim();
}
}
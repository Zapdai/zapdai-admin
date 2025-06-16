import { Component, EventEmitter, Output, output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector:"app-carrinho",
    standalone:true,
    imports:[MatIconModule,MatButtonModule],
    templateUrl:"./carrinho.component.html",
    styleUrl:"./carrinho.component.scss"
})
export class CarrinhoComponent{
    @Output()  desbiledCarEmit = new EventEmitter();
    desabiledCar(){
        this.desbiledCarEmit.emit()
    }
    filhoClicado(event: Event) {
  event.stopPropagation();
}
}
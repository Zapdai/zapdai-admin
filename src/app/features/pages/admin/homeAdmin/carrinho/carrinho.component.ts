import { Component, EventEmitter, OnInit, Output, output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { ItemCarrinhoComponent } from "./itemCarrinho/itemCarrinho.component";
import { CommonModule } from "@angular/common";

@Component({
    selector:"app-carrinho",
    standalone:true,
    imports: [MatIconModule, MatButtonModule, ItemCarrinhoComponent, CommonModule],
    templateUrl:"./carrinho.component.html",
    styleUrl:"./carrinho.component.scss"
})

export class CarrinhoComponent implements OnInit {
  itensCarrinho: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.carregarCarrinhoDoLocalStorage();
  }

  @Output() desbiledCarEmit = new EventEmitter();

  desabiledCar() {
    this.desbiledCarEmit.emit();
  }

  filhoClicado(event: Event) {
    event.stopPropagation();
  }

  carregarCarrinhoDoLocalStorage() {
    const carrinhoStr = localStorage.getItem('carrinho');
    const carrinho = carrinhoStr ? JSON.parse(carrinhoStr) : { itensPedido: [] };
    this.itensCarrinho = carrinho.itensPedido;
  }

  get subtotal(): number {
    return this.itensCarrinho.reduce((acc, item) => acc + item.price * item.amountQTD, 0);
  }
}

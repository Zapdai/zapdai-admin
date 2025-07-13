import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, OnInit, Output, output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { ItemCarrinhoComponent } from "./itemCarrinho/itemCarrinho.component";
import { CommonModule } from "@angular/common";
import { firstValueFrom } from "rxjs";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { carrinhoPorEmpresa, itensPedido, PedidoType } from "../../../../shared/core/pedidos/pedidos";
import { PedidosService } from "../../../../services/pedidosService/pedidos.service";
import { AuthDecodeService } from "../../../../services/AuthUser.service";
import { SnackService } from "../../../../services/snackBar/snack.service";
import { Router } from "@angular/router";

@Component({
   selector: "app-carrinho",
   standalone: true,
   imports: [MatIconModule, MatButtonModule, ItemCarrinhoComponent, CommonModule, MatProgressSpinnerModule],
   templateUrl: "./carrinho.component.html",
   styleUrl: "./carrinho.component.scss",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class CarrinhoComponent implements OnInit {
   itensCarrinho: itensPedido[] = [];
   carrinhoPorEmpresa: carrinhoPorEmpresa = {};
   carregando = false;
   totalItensCarrinho: number = 0;

   @Output() desbiledCarEmit = new EventEmitter();

   constructor(
      private pedidosService: PedidosService,
      public authDecodeUser: AuthDecodeService,
      private snack: SnackService,
      public router: Router,
   ) { }

   ngOnInit(): void {
      this.carregarCarrinhoDoLocalStorage();
   }

   desabiledCar() {
      this.desbiledCarEmit.emit();
   }

   filhoClicado(event: Event) {
      event.stopPropagation();
   }

   carrinhoKeys(): string[] {
      return Object.keys(this.carrinhoPorEmpresa);
   }


   atualizarQuantidadeProduto(event: { idProduto: number, novaQuantidade: number }) {
      const { idProduto, novaQuantidade } = event;

      for (const empresaId in this.carrinhoPorEmpresa) {
         const item = this.carrinhoPorEmpresa[empresaId].itensPedido.find(p => p.idProduto === idProduto);
         if (item) {
            item.amountQTD = novaQuantidade;
            break;
         }
      }

      this.atualizarItensCarrinhoDeObjeto();
      this.salvarCarrinhoNoLocalStorage();
   }



   removerItemCarrinho(idProduto: number) {
      for (const empresaId in this.carrinhoPorEmpresa) {
         const itens = this.carrinhoPorEmpresa[empresaId].itensPedido;
         const index = itens.findIndex(item => item.idProduto === idProduto);
         if (index !== -1) {
            itens.splice(index, 1);
            // Se empresa ficar sem itens, remove empresa
            if (itens.length === 0) {
               delete this.carrinhoPorEmpresa[empresaId];
            }
            break;
         }
      }

      this.atualizarItensCarrinhoDeObjeto();
      this.salvarCarrinhoNoLocalStorage();
   }

   carregarCarrinhoDoLocalStorage() {
      const carrinhoStr = localStorage.getItem('carrinho');
      this.carrinhoPorEmpresa = carrinhoStr ? JSON.parse(carrinhoStr) : {};
      this.atualizarItensCarrinhoDeObjeto();
   }

   atualizarItensCarrinhoDeObjeto() {
      // converte o objeto agrupado para lista simples para renderizar
      this.itensCarrinho = [];
      for (const empresaId in this.carrinhoPorEmpresa) {
         this.itensCarrinho.push(...this.carrinhoPorEmpresa[empresaId].itensPedido);
      }
   }

   salvarCarrinhoNoLocalStorage() {
      localStorage.setItem('carrinho', JSON.stringify(this.carrinhoPorEmpresa));
   }

   get subtotal(): number {
      return this.itensCarrinho.reduce((acc, item) => acc + item.price * item.amountQTD, 0);
   }

   pageFinalizarPedido() {
      this.router.navigate(['/finalizar-pedido'])
   }
}
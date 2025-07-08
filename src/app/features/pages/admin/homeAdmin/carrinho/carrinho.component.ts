import { Component, EventEmitter, OnInit, Output, output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { ItemCarrinhoComponent } from "./itemCarrinho/itemCarrinho.component";
import { CommonModule } from "@angular/common";
import { PedidosService } from "../../../../../services/pedidosService/pedidos.service";
import { firstValueFrom } from "rxjs";
import { AuthDecodeService } from "../../../../../services/AuthUser.service";
import { PedidoType } from "../../../../../shared/core/pedidos/pedidos";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
   selector: "app-carrinho",
   standalone: true,
   imports: [MatIconModule, MatButtonModule, ItemCarrinhoComponent, CommonModule, MatProgressSpinnerModule],
   templateUrl: "./carrinho.component.html",
   styleUrl: "./carrinho.component.scss"
})

export class CarrinhoComponent implements OnInit {
   itensCarrinho: any[] = [];
   carregando = false;

   constructor(
      private pedidosService: PedidosService,
      public authDecodeUser: AuthDecodeService,
   ) { }

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

   atualizarQuantidadeProduto(event: { idProduto: number, novaQuantidade: number }) {
      const { idProduto, novaQuantidade } = event;
      const index = this.itensCarrinho.findIndex(p => p.idProduto === idProduto);
      if (index !== -1) {
         this.itensCarrinho[index].amountQTD = novaQuantidade;
         this.salvarCarrinhoNoLocalStorage();
      }
   }


   salvarCarrinhoNoLocalStorage() {
      const carrinho = {
         itensPedido: this.itensCarrinho
      };
      localStorage.setItem('carrinho', JSON.stringify(carrinho));
   }




   carregarCarrinhoDoLocalStorage() {
      const carrinhoStr = localStorage.getItem('carrinho');
      const carrinho = carrinhoStr ? JSON.parse(carrinhoStr) : { itensPedido: [] };
      this.itensCarrinho = carrinho.itensPedido;
   }

   get subtotal(): number {
      return this.itensCarrinho.reduce((acc, item) => acc + item.price * item.amountQTD, 0);
   }

   async finalizarPedido() {
      try {
         const carrinhoStr = localStorage.getItem('carrinho');
         const carrinho = carrinhoStr ? JSON.parse(carrinhoStr) : { itensPedido: [] };

         if (!carrinho.itensPedido || carrinho.itensPedido.length === 0) {
            throw new Error('Carrinho vazio.');
         }

         if (this.carregando) {
            return; // evita chamadas múltiplas
         }

         const pedidoPayload: PedidoType = {
            IdUsuario: this.authDecodeUser.getusuarioId(),
            itens: carrinho.itensPedido.map((item: any) => ({
               quantidade: item.amountQTD,
               id: item.idProduto
            })),
            pagamento: {
               formaDePagament: 'PIX'
            }
         };

         this.carregando = true;
         console.log(pedidoPayload)
         const resposta = await firstValueFrom(this.pedidosService.criarPedido(pedidoPayload));

         console.log('✅ Pedido criado com sucesso:', resposta);
         localStorage.removeItem('carrinho'); // limpa o carrinho
         // Ex: redirecionar, abrir modal, ou atualizar tela

      } catch (erro) {
         this.carregando = false;
         // Ex: mostrar snackbar ou alert com erro
      } finally {
         this.carregando = false;
      }
   }
}

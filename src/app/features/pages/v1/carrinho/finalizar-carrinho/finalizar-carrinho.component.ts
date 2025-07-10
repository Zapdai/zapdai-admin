import { Component, EventEmitter, OnInit, Output, output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { PedidosService } from "../../../../../services/pedidosService/pedidos.service";
import { firstValueFrom } from "rxjs";
import { AuthDecodeService } from "../../../../../services/AuthUser.service";
import { carrinhoPorEmpresa, itensPedido, PedidoType } from "../../../../../shared/core/pedidos/pedidos";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { SnackService } from "../../../../../services/snackBar/snack.service";
import { ItemCarrinhoComponent } from "../itemCarrinho/itemCarrinho.component";
import { headerComponent } from "../../../../../shared/component/header/header.component";
import { MobileNavbarComponent } from "../../../../../shared/component/mobile-navbar/mobile-navbar.component";
import { CarrinhoComponent } from "../carrinho.component";

@Component({
   selector: "app-finalizar-carrinho",
   standalone: true,
   imports: [MatIconModule, MatButtonModule, ItemCarrinhoComponent, CommonModule, MatProgressSpinnerModule, headerComponent, MobileNavbarComponent, CarrinhoComponent],
   templateUrl: "./finalizar-carrinho.component.html",
   styleUrl: "./finalizar-carrinho.component.scss"
})

export class FinalizarCarrinhoComponent implements OnInit {
   itensCarrinho: itensPedido[] = [];
   carrinhoPorEmpresa: carrinhoPorEmpresa = {};
   carregando = false;
   totalItensCarrinho: number = 0;
   ativaCar?: boolean;

   @Output() desbiledCarEmit = new EventEmitter();

   constructor(
      private pedidosService: PedidosService,
      public authDecodeUser: AuthDecodeService,
      private snack: SnackService,
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

   async finalizarPedido() {
      try {
         if (this.itensCarrinho.length === 0) {
            throw new Error('Carrinho vazio.');
         }

         if (this.carregando) return;

         const pedidoPayload: PedidoType = {
            IdUsuario: this.authDecodeUser.getusuarioId(),
            itens: this.itensCarrinho.map(item => ({
               quantidade: item.amountQTD,
               id: item.idProduto
            })),
            pagamento: {
               formaDePagament: 'PIX'
            }
         };

         this.carregando = true;
         const resposta = await firstValueFrom(this.pedidosService.criarPedido(pedidoPayload));
         console.log('✅ Pedido criado:', resposta);

         localStorage.removeItem('carrinho'); // limpa carrinho
         this.itensCarrinho = [];
         this.carrinhoPorEmpresa = {};
         // mostrar mensagem ou redirecionar

      } catch (erro) {
         this.snack.error('Erro ao finalizar pedido.');
      } finally {
         this.carregando = false;
      }
   }


   ativaCarrinho() {
      this.ativaCar = !this.ativaCar;
   }
}
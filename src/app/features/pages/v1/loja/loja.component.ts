import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { ActivatedRoute } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { ApiV1Loja } from "../../../../services/apiCategorias/apiV1Loja.service";
import { MatIconModule } from "@angular/material/icon";
import { itensPedido, listItensPedido } from "../../../../shared/core/pedidos/pedidos";
import { SnackService } from "../../../../services/snackBar/snack.service";

@Component({
   selector: 'app-loja',
   imports: [MatTabsModule, ReactiveFormsModule, CommonModule, MatInputModule, MatIconModule],
   templateUrl: './loja.component.html',
   styleUrl: './loja.component.scss'
})
export class AppLojaComponent implements OnInit {
   [x: string]: any;
   idProduto: any;
   produto: any = {};
   quantidade: number = 1;
   isLoading = true;


   @ViewChild("scrollContainer", { static: false }) fer?: ElementRef;


   constructor(
      public route: ActivatedRoute,
      private api: ApiV1Loja,
      private snack: SnackService,
   ) {

   }
   ngOnInit(): void {
      this.rodaFuncaoApi()
   }
   imagemSelecionadaItem(imagem: any) {
      this.imagemSelecionada = imagem;
   }

   async rodaFuncaoApi() {
      try {
         this.idProduto = this.route.snapshot.paramMap.get("id");
         const resposta = await firstValueFrom(this.api.findOneProduto(this.idProduto));
         this.produto = resposta ?? {};
      } catch (error) {
         this.produto = {};
      } finally {
         this.isLoading = false;
      }
   }

   imagemSelecionada: string | null = null;
   rolarDireita(event: any) {
      console.log(event)
      this.fer?.nativeElement.scrollBy({
         left: -20,
         behavior: 'smooth'
      })
   }
   rolarEsquerda() {
      this.fer?.nativeElement.scrollBy({
         left: 20,
         behavior: 'smooth'
      })
   }


   adicionarAoCarrinho(produto: any): void {
      const novoItem: itensPedido = {
         idProduto: produto.idProduto,
         imgProduct: produto.imgProduct || produto.imgUrl,
         productName: produto.productName,
         price: produto.price,
         peso: produto.peso,
         categoriaProduct: produto.categoriaProduct ?? null,
         description: produto.description || '',
         amountQTD: this.quantidade
      };

      // Recupera carrinho do localStorage
      const carrinhoStr = localStorage.getItem('carrinho');
      let carrinho: listItensPedido = carrinhoStr ? JSON.parse(carrinhoStr) : { itensPedido: [] };

      // Verifica se produto já existe no carrinho
      const existente = carrinho.itensPedido.find(p => p.idProduto === novoItem.idProduto);

      if (existente) {
         existente.amountQTD += this.quantidade;
      } else {
         carrinho.itensPedido.push(novoItem);
      }

      // Salva carrinho atualizado no localStorage
      localStorage.setItem('carrinho', JSON.stringify(carrinho));

      // (Opcional) Mensagem de sucesso ou snack
      this.snack.success('Produto adicionado ao carrinho!');
   }

}
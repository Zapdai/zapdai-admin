import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { ActivatedRoute } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { ApiV1Loja } from "../../../../services/apiCategorias/apiV1Loja.service";
import { MatIconModule } from "@angular/material/icon";
import { carrinhoPorEmpresa, itensPedido, listItensPedido } from "../../../../shared/core/pedidos/pedidos";
import { SnackService } from "../../../../services/snackBar/snack.service";
import { headerComponent } from "../../../../shared/component/header/header.component";
import { MobileNavbarComponent } from "../../../../shared/component/mobile-navbar/mobile-navbar.component";
import { CarrinhoComponent } from "../../admin/homeAdmin/carrinho/carrinho.component";

@Component({
   selector: 'app-loja',
   imports: [MatTabsModule, ReactiveFormsModule, CommonModule, MatInputModule, MatIconModule, headerComponent, MobileNavbarComponent, CarrinhoComponent],
   templateUrl: './loja.component.html',
   styleUrl: './loja.component.scss'
})


export class AppLojaComponent implements OnInit {
   [x: string]: any;
   idProduto: any;
   produto: any = {};
   quantidade: number = 1;
   isLoading = true;
   ativaCar?: boolean;


   @ViewChild("scrollContainer", { static: false }) fer?: ElementRef;
   @Output() emitCarrinho = new EventEmitter();


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

   get carrinhoAgrupadoArray() {
      const carrinhoStr = localStorage.getItem('carrinho');
      if (!carrinhoStr) return [];
      const carrinhoObj: carrinhoPorEmpresa = JSON.parse(carrinhoStr);

      return Object.entries(carrinhoObj).map(([empresaId, empresaData]) => ({
         empresaId,
         nomeCompania: empresaData.nomeCompania,
         itensPedido: empresaData.itensPedido
      }));
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
         amountQTD: this.quantidade,
         empresaDTO: {
            id: produto.empresaDTO.id,
            nomeCompania: produto.empresaDTO.nomeCompania,
            // outros campos que desejar
         }
      };

      // Recupera carrinho do localStorage
      const carrinhoStr = localStorage.getItem('carrinho');
      let carrinho: carrinhoPorEmpresa = carrinhoStr ? JSON.parse(carrinhoStr) : {};

      // Pega o id da empresa do produto
      const empresaId = novoItem.empresaDTO.id;

      // Se não existir essa empresa no carrinho, cria o grupo
      if (!carrinho[empresaId]) {
         carrinho[empresaId] = {
            nomeCompania: novoItem.empresaDTO.nomeCompania,
            itensPedido: []
         };
      }

      // Procura se o produto já existe dentro da empresa
      const existente = carrinho[empresaId].itensPedido.find(p => p.idProduto === novoItem.idProduto);

      if (existente) {
         existente.amountQTD += this.quantidade; // aumenta a quantidade
      } else {
         carrinho[empresaId].itensPedido.push(novoItem); // adiciona novo item
      }

      // Salva carrinho atualizado no localStorage
      localStorage.setItem('carrinho', JSON.stringify(carrinho));

      this.snack.success('Produto adicionado ao carrinho!');
   }

   ativaCarrinho() {
      this.ativaCar = !this.ativaCar;
   }

}
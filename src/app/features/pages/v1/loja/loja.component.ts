import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { ActivatedRoute } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { ApiV1Loja } from "../../../../services/apiCategorias/apiV1Loja.service";
import { MatIconModule } from "@angular/material/icon";

@Component({
   selector: 'app-loja',
   imports: [MatTabsModule, ReactiveFormsModule, CommonModule, MatInputModule, MatIconModule],
   templateUrl: './loja.component.html',
   styleUrl: './loja.component.scss'
})
export class AppLojaComponent implements OnInit {
   [x: string]: any;
   idProduto: any;
   produto: any
   quantidade: number = 1;
   @ViewChild("scrollContainer", { static: false }) fer?: ElementRef;


   constructor(public route: ActivatedRoute, private api: ApiV1Loja) {

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


         this.produto = resposta || {}; // previne erro
      } catch (error) {
         this.produto = {}; // fallback seguro
      }
   }


   imagemSelecionada: string | null = null;
   adicionarAoCarrinho(produto: any): void {
      const item = {
         ...produto,
         quantidade: this.quantidade
      };
   }
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
}
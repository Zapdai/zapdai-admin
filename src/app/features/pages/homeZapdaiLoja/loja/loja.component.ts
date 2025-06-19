import { Component, OnInit } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { ActivatedRoute } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { ApiV1Loja } from "../../../../services/apiCategorias/apiV1Loja.service";

@Component({
   selector: 'app-loja',
   imports: [MatTabsModule, ReactiveFormsModule, CommonModule, MatInputModule],
   templateUrl: './loja.component.html',
   styleUrl: './loja.component.scss'
})
export class AppLojaComponent implements OnInit {
   [x: string]: any;
   idProduto: any;
   produto: any
   quantidade: number = 1;

   constructor(public route: ActivatedRoute, private api: ApiV1Loja) {

   }
   ngOnInit(): void {
      this.rodaFuncaoApi()
   }

   async rodaFuncaoApi() {
      try {
         this.idProduto = this.route.snapshot.paramMap.get("id") as any
         const resposta = await firstValueFrom(this.api.findOneProduto(this.idProduto));
         this.produto = resposta;

      } catch (error) {

      }

   }
   imagemSelecionada: string | null = null;
   adicionarAoCarrinho(produto: any): void {
      const item = {
         ...produto,
         quantidade: this.quantidade
      };
   }
}
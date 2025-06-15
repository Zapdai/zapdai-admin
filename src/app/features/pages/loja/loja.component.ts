import { Component, OnInit } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { ActivatedRoute } from "@angular/router";
import { ApiCategorias } from "../../../services/apiCategorias/apiCategorias.service";
import { firstValueFrom } from "rxjs";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";

@Component({
   selector: 'app-loja',
   imports: [MatTabsModule,ReactiveFormsModule,CommonModule,MatInputModule],
   templateUrl: './loja.component.html',
   styleUrl: './loja.component.scss'
})
export class AppLojaComponent implements OnInit {
   idProduto: any;
   produto:any
   quantidade: number = 1;

   constructor(public route: ActivatedRoute, private api: ApiCategorias) {

   }
   ngOnInit(): void {
      this.rodaFuncaoApi()
   }

   async rodaFuncaoApi() {
      try {
         this.idProduto = this.route.snapshot.paramMap.get("nome") as any
         const resposta = await firstValueFrom(this.api.findOneProduto(this.idProduto));
         console.log("data"+resposta.idProduto)
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
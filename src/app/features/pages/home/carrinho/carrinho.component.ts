import { Component, EventEmitter, OnInit, Output, output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { AppLojaComponent } from "./loja/loja.component";
import { ApiV1Loja } from "../../../../services/apiCategorias/apiV1Loja.service";
import { firstValueFrom } from "rxjs";

@Component({
    selector:"app-carrinho",
    standalone:true,
    imports:[MatIconModule,MatButtonModule,AppLojaComponent],
    templateUrl:"./carrinho.component.html",
    styleUrl:"./carrinho.component.scss"
})
export class CarrinhoComponent implements OnInit{
    produto:any
       constructor( private api: ApiV1Loja) {}
    ngOnInit(): void {
      this.rodaFuncaoApi()
   }
    @Output()  desbiledCarEmit = new EventEmitter();
    desabiledCar(){
        this.desbiledCarEmit.emit()
    }
    filhoClicado(event: Event) {
  event.stopPropagation();
   

}


   /// api de teste nao original do carrinho
 
   async rodaFuncaoApi() {
      try {
         const resposta = await firstValueFrom(this.api.findOneProduto(33));
         this.produto = resposta;
         console.log("dacc")

      } catch (error) {

      }

   }

}
import { Component, EventEmitter, OnInit, Output, output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { firstValueFrom } from "rxjs";
import { ApiV1Loja } from "../../../../../services/apiCategorias/apiV1Loja.service";
import { DropComponent } from "../../../../../shared/component/drop/drop.component";
import { ProdutosApiService } from "../../../../../services/produtoService/produtosApi.service";
import { SnackService } from "../../../../../services/snackBar/snack.service";
import { Router } from "@angular/router";

@Component({
   selector: "app-create-product",
   standalone: true,
   imports: [MatIconModule, MatButtonModule,DropComponent],
   templateUrl: "./create-product.component.html",
   styleUrl: "./create-product.component.scss"
})
export class CreateProductComponent implements OnInit {
   produto: any
   files: File[] = [];
   

   constructor(private api: ApiV1Loja,private apiCadastroProdutos:ProdutosApiService,private snack:SnackService,private router:Router) { }
   ngOnInit(): void {
   }
   @Output() desbiledCarEmit = new EventEmitter();
   desabiledCar() {
      this.desbiledCarEmit.emit()
   }
   filhoClicado(event: Event) {
      event.stopPropagation();


   }
   select(event:any){
     this.files = event;
     console.log("Imagems vindo do drop "+event)
   }
  async saveProduct(){
   const data:any = {
	"idEmpresa": "empresa-key1749865350179-96879",
  "productName": "franco com arroz",
  "price": 15.80,
  "peso": 5.1,
  "categoria": {
		"id":7
	}
		,
  "description": "Carne com calabresa  e arroz",
  "amountQTD": 5
};
   const response = await firstValueFrom(this.apiCadastroProdutos.cadastroDeProduto(data,this.files));
   if(response){
      this.snack.openSnackBar(response);
       setTimeout(() => {
            this.router.navigateByUrl('/loading', { skipLocationChange: true}).then(()=>{
                setTimeout(() => {
                    this.router.navigate(['/admin/produtos'])
                }, 2000);
            })
            
        }, 0);

   }
}

}
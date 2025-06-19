import { Component, EventEmitter, OnInit, Output, output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { firstValueFrom } from "rxjs";
import { ApiV1Loja } from "../../../../../services/apiCategorias/apiV1Loja.service";
import { DropComponent } from "../../../../../shared/component/drop/drop.component";

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

   constructor(private api: ApiV1Loja) { }
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

}
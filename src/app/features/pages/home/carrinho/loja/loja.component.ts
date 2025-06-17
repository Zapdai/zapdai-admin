import {  Component, Input } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";

@Component({
   selector: 'app-item',
   standalone:true,
   imports: [MatTabsModule,ReactiveFormsModule,CommonModule,MatInputModule],
   templateUrl: './loja.component.html',
   styleUrl: './loja.component.scss'
})
export class AppLojaComponent{
[x: string]: any;
   idProduto: any;
 @Input()  produto:any
   quantidade: number = 1;


imagemSelecionada: string | null = null;
adicionarAoCarrinho(produto: any): void {
  const item = {
    quantidade: this.quantidade
  };
}
}
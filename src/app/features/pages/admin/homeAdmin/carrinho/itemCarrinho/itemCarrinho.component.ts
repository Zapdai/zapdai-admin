import {  Component, Input } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";

@Component({
   selector: 'app-item-carrinho',
   standalone:true,
   imports: [MatTabsModule,ReactiveFormsModule,CommonModule,MatInputModule],
   templateUrl: './itemCarrinho.component.html',
   styleUrl: './itemCarrinho.component.scss'
})

export class ItemCarrinhoComponent {
  @Input() produto: any;
  quantidade: number = 1;


diminuirQuantidade() {
  this.quantidade = Math.max(1, this.quantidade - 1);
}

  ngOnChanges() {
    if (this.produto?.amountQTD) {
      this.quantidade = this.produto.amountQTD;
    }
  }
}

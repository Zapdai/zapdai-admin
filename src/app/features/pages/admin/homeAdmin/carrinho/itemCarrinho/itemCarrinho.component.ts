import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: 'app-item-carrinho',
  standalone: true,
  imports: [MatTabsModule, ReactiveFormsModule, CommonModule, MatInputModule],
  templateUrl: './itemCarrinho.component.html',
  styleUrl: './itemCarrinho.component.scss'
})

export class ItemCarrinhoComponent implements OnChanges {
  @Input() produto: any;
  @Output() quantidadeChange = new EventEmitter<{ idProduto: number, novaQuantidade: number }>();
  quantidade: number = 1;


  ngOnChanges(changes: SimpleChanges) {
    if (this.produto?.amountQTD) {
      this.quantidade = this.produto.amountQTD;
    }
  }

  diminuirQuantidade() {
    this.quantidade = Math.max(1, this.quantidade - 1);
    this.emitirAtualizacao();
  }

  aumentarQuantidade() {
    this.quantidade++;
    this.emitirAtualizacao();
  }

  atualizarManual(event: any) {
    const valor = Number(event.target.value);
    this.quantidade = Math.max(1, isNaN(valor) ? 1 : valor);
    this.emitirAtualizacao();
  }

  emitirAtualizacao() {
    this.quantidadeChange.emit({
      idProduto: this.produto.idProduto,
      novaQuantidade: this.quantidade
    });
  }

  aoDigitarQuantidade(event: Event) {
  const input = event.target as HTMLInputElement;
  const valor = Number(input.value);

  if (!isNaN(valor) && valor > 0) {
    this.quantidade = valor;
    this.emitirAtualizacao();
  } else {
    // Volta para valor anterior se valor for inválido
    input.value = this.quantidade.toString();
  }
}

}

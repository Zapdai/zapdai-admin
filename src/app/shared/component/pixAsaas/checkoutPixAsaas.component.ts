import { Component, Input } from "@angular/core";
import { PixPaymentRespons } from "../../core/types/paymentPagamentopix";
import { QRCodeComponent } from 'angularx-qrcode';
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-checkoutPixAsaas",
  standalone: true,
  imports: [QRCodeComponent, CommonModule, MatButtonModule, MatIconModule],
  templateUrl: "./checkoutPixAsaas.component.html",
  styleUrl: "checkoutPixAsaas.component.scss"
})

export class CheckoutPixAsaasComponent {
  btnActive = false;
  titule: "Copie a chave Pix" | "Copiado" = "Copie a chave Pix";
  @Input() respostaApi: PixPaymentRespons = {
    chave: ''
  }
  cortarTexto(texto: string, limite: number): string {
    if (texto.length <= limite) return texto;
    return texto.substring(0, limite) + '...';
  }
  colcarTexto(valor: string) {
    this.titule = "Copiado"
    navigator.clipboard.writeText(valor).then(() => {
      this.btnActive = true;

    })
  }

  
}


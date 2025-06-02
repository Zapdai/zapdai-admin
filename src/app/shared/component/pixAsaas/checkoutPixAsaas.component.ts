import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { PixPaymentRespons } from "../../core/types/paymentPagamentopix";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import * as QRCode from 'qrcode';

@Component({
  selector: "app-checkoutPixAsaas",
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: "./checkoutPixAsaas.component.html",
  styleUrl: "checkoutPixAsaas.component.scss"
})
export class CheckoutPixAsaasComponent implements OnChanges {
  btnActive = false;
  titule: "Copie a chave Pix" | "Copiado" = "Copie a chave Pix";
  qrCodeDataUrl = '';
  @Input() respostaApi: PixPaymentRespons = { chave: '', qr: '' }

   ngOnChanges(changes: SimpleChanges) {
    if (changes['respostaApi'] && this.respostaApi.chave) {
      QRCode.toDataURL(this.respostaApi.chave, {
        errorCorrectionLevel: 'H',
        margin: 1,
        scale: 8,
        type: 'image/png'
      }).then(url => {
        this.qrCodeDataUrl = url;
      }).catch(err => {
        console.error('Erro ao gerar QR code', err);
      });
    }
  }

  cortarTexto(texto: string, limite: number): string {
    return texto.length <= limite ? texto : texto.substring(0, limite) + '...';
  }

  colcarTexto(valor: string) {
    this.titule = "Copiado";
    navigator.clipboard.writeText(valor).then(() => {
      this.btnActive = true;
    });
  }
}

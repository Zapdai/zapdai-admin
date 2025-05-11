import { Component, Input, OnInit } from "@angular/core";
import { PixPaymentRespons } from "../../core/types/paymentPagamentopix";
import { QRCodeComponent } from 'angularx-qrcode';
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
declare var MercadoPago: any
@Component({
  selector: "app-checkoutPix",
  standalone: true,
  imports: [QRCodeComponent, CommonModule, MatButtonModule, MatIconModule],
  templateUrl: "./checkoutPix.component.html",
  styleUrl: "checkoutPix.component.scss"
})
export class CheckoutPixComponent implements OnInit {
  btnActive = false;
  titule: "Copie a chave Pix" | "Copiado" = "Copie a chave Pix";
  @Input() qr: PixPaymentRespons = {
    qrCodeLink: ''
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

  ngOnInit(): void {
    const mp = new MercadoPago('APP_USR-8bcff43a-21c1-465b-86b5-066af2ef1efe');

    mp.bricks().create('cardPayment', 'cardPaymentBrick_container', {
      initialization: {
        amount: 100, // valor da compra
      },
      callbacks: {
        onReady: () => {
          // Brick carregado
        },
        onSubmit: async (cardFormData:any) => {
          // Aqui você envia para seu backend para criar o pagamento
          console.log("Token seguro gerado", cardFormData.token);
        },
        onError: (error:any) => {
          console.error(error);
        },
      }
    });
  }
}


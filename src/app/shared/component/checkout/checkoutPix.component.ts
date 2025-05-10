import { AfterViewInit, Component, Input } from "@angular/core";
import { PageContainerComponent } from "../page-container/page-container.component";
import { PixPaymentRespons } from "../../core/types/paymentPagamentopix";
import {QRCodeComponent  } from 'angularx-qrcode';
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

declare var MercadoPago: any;
  
    @Component({
        selector:"app-checkoutPix",
        standalone:true,
        imports: [QRCodeComponent, CommonModule,MatButtonModule,MatIconModule],
        templateUrl:"./checkoutPix.component.html",
        styleUrl:"checkoutPix.component.scss"
    })
    export class CheckoutPixComponent implements AfterViewInit {
        btnActive = false;
        titule:"Copie a chave Pix"|"Copiado" = "Copie a chave Pix";
        @Input() qr: PixPaymentRespons = {
            qrCodeLink: ''
        }
     ngAfterViewInit(): void {
       
     }
      cortarTexto(texto: string, limite: number): string {
        if (texto.length <= limite) return texto;
        return texto.substring(0, limite) + '...';
      }
      colcarTexto(valor:string){
        this.titule = "Copiado"
        navigator.clipboard.writeText(valor).then(()=>{
            this.btnActive = true;

        })
      }
    }
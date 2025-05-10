import { AfterViewInit, Component, Input } from "@angular/core";
import { PageContainerComponent } from "../page-container/page-container.component";
import { PixPaymentRespons } from "../../core/types/paymentPagamentopix";
import {QRCodeComponent  } from 'angularx-qrcode';
import { CommonModule } from "@angular/common";

declare var MercadoPago: any;

    @Component({
        selector:"app-checkoutPix",
        standalone:true,
        imports: [QRCodeComponent, CommonModule],
        templateUrl:"./checkoutPix.component.html",
        styleUrl:"checkoutPix.component.scss"
    })
    export class CheckoutPixComponent implements AfterViewInit {
        @Input() qr: PixPaymentRespons = {
            qrCodeLink: ''
        }
     ngAfterViewInit(): void {
       
     }
    }
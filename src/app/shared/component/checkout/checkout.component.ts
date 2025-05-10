import { AfterViewInit, Component, Input } from "@angular/core";
import { PageContainerComponent } from "../page-container/page-container.component";
import { PixPaymentRespons } from "../../core/types/paymentPagamentopix";
import {QRCodeComponent  } from 'angularx-qrcode';

declare var MercadoPago: any;

    @Component({
        selector:"app-checkout",
        standalone:true,
        imports: [QRCodeComponent],
        templateUrl:"./checkout.component.html",
        styleUrl:"checkout.component.scss"
    })
    export class CheckoutComponent implements AfterViewInit {
        @Input() qr!:PixPaymentRespons;
     ngAfterViewInit(): void {
       
     }
    }
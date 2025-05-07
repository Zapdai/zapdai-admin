import { AfterViewInit, Component } from "@angular/core";
declare var MercadoPago: any;

    @Component({
        selector:"app-checkout",
        standalone:true,
        imports:[],
        templateUrl:"./checout.component.html",
        styleUrl:"checout.component.scss"
    })
    export class CheckoutComponent implements AfterViewInit {
     ngAfterViewInit(): void {
       
     }
    }
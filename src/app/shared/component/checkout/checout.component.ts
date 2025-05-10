import { AfterViewInit, Component } from "@angular/core";
import { PageContainerComponent } from "../page-container/page-container.component";
declare var MercadoPago: any;

    @Component({
        selector:"app-checkout",
        standalone:true,
        imports: [PageContainerComponent],
        templateUrl:"./checout.component.html",
        styleUrl:"checout.component.scss"
    })
    export class CheckoutComponent implements AfterViewInit {
     ngAfterViewInit(): void {
       
     }
    }
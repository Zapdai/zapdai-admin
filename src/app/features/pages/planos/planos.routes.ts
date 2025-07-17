import { Routes } from "@angular/router"
import { PlanosComponent } from "./planos.component"
import { authGuardian } from "../../../services/auth.guard"
import { CheckoutPlanos03Component } from "./checkout03/checkoutPlanos03.component"
import { PosCheckoutComponent } from "./posCheckout/posCheckout.component"
import { LoadingPaymentComponent } from "./loadingPayment/loadingPayment.component"
import { Checkout05AssasComponent } from "./checkout05Assas/checkout05Assas.component"


export const routes: Routes = [
    {
        path: '', component: PlanosComponent, title: "Tela de Planos e Preços - Zapdai", children: [            
            {
                path:"checkout", component: Checkout05AssasComponent, title: "Tela de Checkout - Zapdai"
            },
            {
                path:"checkout02", component: Checkout05AssasComponent, title: "Tela de Checkout - Zapdai", canActivate:[authGuardian]
            },
            {
                path:"payment",component:CheckoutPlanos03Component
            },
            {
                path:"pos-checkout", component:PosCheckoutComponent, title: "Tela de Obrigado - Zapdai", 
                canActivate:[authGuardian]
            },
            {
                path:"loadingPayment", component:LoadingPaymentComponent, title: "Acessar Negocio - Zapdai", 
                canActivate:[authGuardian]
            }
        ]
    }
]
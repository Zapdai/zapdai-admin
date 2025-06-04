import { Routes } from "@angular/router"
import { checkoutPlanosComponent } from "./checkout01/checkoutPlanos.component"
import { PlanosComponent } from "./planos.component"
import { HomePlanosComponent } from "./homePlanos/homePlanos.component"
import { authGuardian } from "../../../services/auth.guard"
import { CheckoutPlanos02Component } from "./checkout02/checkoutPlanos02.component"
import { CheckoutPlanos03Component } from "./checkout03/checkoutPlanos03.component"
import { PosCheckoutComponent } from "./posCheckout/posCheckout.component"
import { CadastroEmpresaComponent } from "../cadastro-empresa/cadastro-empresa.component"
import { LoadingPaymentComponent } from "./loadingPayment/loadingPayment.component"
import { CheckoutPlanos04Component } from "./checkout04/checkoutPlanos04.component"
import { Checkout05AssasComponent } from "./checkout05Assas/checkout05Assas.component"


export const routes: Routes = [
    {
        path: '', component: PlanosComponent, title: "Tela de Planos e Preços - Zapdai", children: [            
            {
                path:"", component: HomePlanosComponent, title: "Tela de Planos - Zapdai"
            },
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
            },
            {
                path:"create-business", component:CadastroEmpresaComponent, title: "Tela Cadastro de Empresa - Zapdai", 
                canActivate:[authGuardian], data: { acess: ['ROLE_USER'] }
            },
        ]
    }
]
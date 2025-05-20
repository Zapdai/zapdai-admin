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


export const routes: Routes = [
    {
        path: '', component: PlanosComponent, title: "Tela de Planos e Preços", children: [            
            {
                path:"", component: HomePlanosComponent, title: "Tela de Planos"
            },
            {
                path:"checkout", component: checkoutPlanosComponent, title: "Tela de Checkout"
            },
            {
                path:"checkout02", component: CheckoutPlanos02Component, title: "Tela de Checkout", canActivate:[authGuardian]
            },
            {
                path:"payment",component:CheckoutPlanos03Component
            },
            {
                path:"pos-checkout", component:PosCheckoutComponent, title: "Tela de Obrigado", 
                canActivate:[authGuardian]
            },
            {
                path:"loadingPayment", component:LoadingPaymentComponent, title: "Tela Cadastro de Empresa"
            },
            {
                path:"create-business", component:CadastroEmpresaComponent, title: "Tela Cadastro de Empresa", 
                canActivate:[authGuardian], data: { acess: ['ROLE_USER'] }
            },
        ]
    }
]
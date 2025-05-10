import { Routes } from "@angular/router"
import { checkoutPlanosComponent } from "./checkout01/checkoutPlanos.component"
import { PlanosComponent } from "./planos.component"
import { HomePlanosComponent } from "./homePlanos/homePlanos.component"
import { authGuardian } from "../../../services/auth.guard"


export const routes: Routes = [
    {
        path: '', component: PlanosComponent, title: "Tela de Planos e Preços", children: [            
            {
                path:"", component: HomePlanosComponent, title: "Tela de Planos"
            },
            {
                path:"checkout", component: checkoutPlanosComponent, title: "Tela de Checkout"
            }
        ],
        canActivate:[authGuardian]
    }
]
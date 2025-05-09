import { Routes } from "@angular/router"
import { checkoutPlanosComponent } from "./checkout01/checkoutPlanos.component"
import { PlanosComponent } from "./planos.component"
import { HomePlanosComponent } from "./homePlanos/homePlanos.component"


export const routes: Routes = [
    {
        path: '', component: PlanosComponent, title: "Tela de Planos e Preços", children: [            
            {
                path:"", component: HomePlanosComponent, title: "Tela de Planos"
            },
            {
                path:"checkout", component: checkoutPlanosComponent, title: "Tela de Checkout"
            }
        ]
    }
]
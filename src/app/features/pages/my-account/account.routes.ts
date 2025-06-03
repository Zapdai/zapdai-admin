import { Routes } from "@angular/router"
import { authGuardian } from "../../../services/auth.guard"
import { MyAccountComponent } from "./my-account.component"
import { HomeMyAccountComponent } from "./home-my-account/home-my-account.component"


export const routes: Routes = [
    {
        path: '', component: MyAccountComponent, title: "Minha Conta - Zapdai", children: [            
            {
                path:"", component: HomeMyAccountComponent, title: "Minha Conta - Zapdai", canActivate:[authGuardian]
            },
        ]
    }
]
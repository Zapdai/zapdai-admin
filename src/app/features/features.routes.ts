import { Routes } from "@angular/router"
import { homeComponent } from "./pages/home/home.component"
import { dashBoard } from "./pages/dashboard/dashboard.component";

export const routes:Routes = [
    {
        path:"home", component:homeComponent,title:"Tela home" ,children:[
            {
                path:"dashboard",component:dashBoard
            }
        ]
    }
];
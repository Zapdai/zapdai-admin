import { Routes } from "@angular/router"
import { homeComponent } from "./pages/home/home.component"
import { dashBoard } from "./pages/dashboard/dashboard.component";
import { ClientesComponentes } from "./pages/clientes/clientes.componentes";
import { ProdutosComponentes } from "./pages/produtos/produtos.componentes";
import { DestaqueComponent } from "./pages/destaque/destaque.component";

export const routes:Routes = [
    {
        path:"home", component:homeComponent,title:"Tela home" ,children:[
            {
               path:"",component:DestaqueComponent
            },
            {
                path:"dashboard",component:dashBoard,title:"Dashboard"
            },
            {
                path:"clientes",component:ClientesComponentes,title:"Clientes"
            },
            {
                path:"produtos",component:ProdutosComponentes,title:"Produtos"
            }
        ]
    }
];
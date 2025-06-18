import { Routes } from "@angular/router"
import { homeComponent } from "./pages/home/home.component"
import { ClientesComponentes } from "./pages/clientes/clientes.componentes";
import { DestaqueComponent } from "./pages/destaque/destaque.component";
import { pedidosComponent } from "./pages/pedidos/pedidos.component";
import { authGuardian } from "../services/auth.guard";
import { ProdutosAdminComponent } from "./pages/produtos/produtosAdmin/produtosAdmin.component";
import { dashBoard } from "./pages/dashboard/dashboard.component";

export const routes:Routes = [
    {
        path:"", component:homeComponent,title:"Tela admin" ,children:[
            {
               path:"",component:DestaqueComponent
            },
            {
                path:"dashboard",component:dashBoard,title:"Dashboard - Zapdai"
            },
            {
                path:"clientes",component:ClientesComponentes,title:"Clientes - Zapdai"
            },
            {
                path:"produtos/novo",component:ProdutosAdminComponent,title:"Produtos - Zapdai"
            },
            {
                path:"pedidos",component:pedidosComponent,title:"Pedidos - Zapdai"
            }
        ]
        ,
        canActivate:[authGuardian]
    }
];
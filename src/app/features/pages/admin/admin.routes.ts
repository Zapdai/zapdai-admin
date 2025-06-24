import { Routes } from "@angular/router"
import { homeComponent } from "./homeAdmin/home.component";
import { DestaqueComponent } from "./destaque/destaque.component";
import { dashBoard } from "./dashboard/dashboard.component";
import { ClientesComponentes } from "./clientes/clientes.componentes";
import { ProdutosAdminComponent } from "./produtos/produtosAdmin/produtosAdmin.component";
import { pedidosComponent } from "./pedidos/pedidos.component";
import { authGuardian } from "../../../services/auth.guard";
import { ProdutoEmpresaComponent } from "../empresa/ItensEmpresasUnit/produto-empresa.component";
import { HomeZapdaiComponent } from "../v1/homeZapdai/homeZapdai.component";

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
                path:"produtos",component:ProdutosAdminComponent,title:"Produtos - Zapdai"
            },
            {
                path:"pedidos",component:pedidosComponent,title:"Pedidos - Zapdai"
            }
        ]
        ,
        canActivate:[authGuardian]
    }
];
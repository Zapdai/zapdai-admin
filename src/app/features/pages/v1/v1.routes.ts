import { Routes } from "@angular/router";
import { HomeZapdaiComponent } from "./homeZapdai/homeZapdai.component";
import { buscaProdutos } from "./buscaProdutos/buscaProdutos.component";
import { AppLojaComponent } from "./loja/loja.component";
import { ProdutoEmpresaComponent } from "../empresa/ItensEmpresasUnit/produto-empresa.component";
export const routes: Routes = [
    {
     path:"", component:HomeZapdaiComponent
    },
    {
        path: "categoria/:nome", component: buscaProdutos,
    },
    {
        path: "produto/detalhes/:id", component: AppLojaComponent,
    },{
        path:"empresa/produto/:idEmpresa",component:ProdutoEmpresaComponent
    }
]
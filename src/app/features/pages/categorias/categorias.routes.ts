import { Routes } from "@angular/router";
import { CategoriasComponent } from "./categorias.component";
import { buscaProdutos } from "../buscaProdutos/buscaProdutos.component";
import {AppLojaComponent} from "../loja/loja.component"
export const routes:Routes = [
   
    {
        path:"",component:CategoriasComponent, 
    },
    {
        path:"categoria/:nome",component:buscaProdutos
    },
    {
        path:"detalhes/produto/:id",component:AppLojaComponent
    }
]
import { Routes } from "@angular/router";
import { CategoriasComponent } from "./categorias.component";
import { AppLojaComponent } from "../loja/loja.component";
import { RenderMode } from "@angular/ssr";

export const routes:Routes = [
   
    {
        path:"",component:CategoriasComponent, 
    },
    {
        path:"categoria/:nome",component:AppLojaComponent
    },
    {
        path:"detalhes/produto/:nome",component:AppLojaComponent
    }
]
import { Routes } from "@angular/router";
import { CategoriasComponent } from "./categorias.component";
import { AppLojaComponent } from "../loja/loja.component";

export const routes:Routes = [
   
    {
        path:"",component:CategoriasComponent
    },
    {
        path:"categoria/:nome",component:AppLojaComponent
    }
]
import { Routes } from '@angular/router';
import { CategoriasComponent } from './features/pages/categorias/categorias.component';

export const routes: Routes = [
    {
        path:"",redirectTo:"/home/destaque",pathMatch:"full"
    },
    {
        path:"",loadChildren:()=>import("./features/features.routes").then(rota=>rota.routes)
    },
    {
        path:"categorias",component:CategoriasComponent
    }
];

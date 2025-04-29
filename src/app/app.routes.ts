import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:"",redirectTo:"/home/destaquue",pathMatch:"full"
    },
    {
        path:"home",loadChildren:()=>import("./features/features.routes").then(rota=>rota.routes)
    }
];

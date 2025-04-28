import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:"",redirectTo:"/home/dashboard",pathMatch:"full"
    },
    {
        path:"",loadChildren:()=>import("./features/features.routes").then(rota=>rota.routes)
    }
];

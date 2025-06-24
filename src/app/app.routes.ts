import { Routes } from '@angular/router';
import { authGuardian } from './services/auth.guard';
import { NotFoundComponent } from './features/pages/404/notFound.component';
import { LoadingComponent } from './features/pages/loading/loading.component';
import { loadingGuard } from './services/loading/loading.guard';
import { UnauthorizedComponent } from './features/pages/unauthorized/unauthorized.component';
import { HomeZapdaiComponent } from './features/pages/homeZapdaiLoja/homeZapdai/homeZapdai.component';

export const routes: Routes = [
    {
        path:"new", redirectTo:"/", pathMatch:"full"

    },


    {
        path: "admin", loadChildren: () => import("./features/pages/admin/admin.routes").then(rota => rota.routes), data: { acess: ["ROLE_ADMIN", "ROLE_MODERATOR"] }, canActivateChild: [authGuardian],
    },
    {
        path: "auth", loadChildren: () => import("./features/pages/auth/auth.routes").then(e => e.routes)
    },
    {
        path: "", loadChildren:()=>import("./features/pages/v1/v1.routes").then(e=>e.routes)
    },
    {
        path: "loading", component: LoadingComponent, canActivate: [loadingGuard]
    },
    {
        path: "my-account", loadChildren: () => import("./features/pages/my-account/account.routes").then(rota => rota.routes)
    },
    {
        path: "planos", loadChildren: () => import("./features/pages/planos/planos.routes").then(route => route.routes)
    },
    {
        path: "unauthorized", component: UnauthorizedComponent, canActivate: [loadingGuard]
    },
    {
        path: "**", component: NotFoundComponent, title: "404 Error"
    }
];

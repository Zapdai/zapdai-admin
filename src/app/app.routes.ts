import { Routes } from '@angular/router';
import { authGuardian } from './services/auth.guard';
import { NotFoundComponent } from './features/pages/404/notFound.component';
import { LoadingComponent } from './features/pages/loading/loading.component';
import { loadingGuard } from './services/loading/loading.guard';
import { UnauthorizedComponent } from './features/pages/unauthorized/unauthorized.component';

export const routes: Routes = [
    {
        path: "", redirectTo: "/v1", pathMatch: "full",
    },
    {
        path: "admin", loadChildren: () => import("./features/features.routes").then(rota => rota.routes), data: { acess: ["ROLE_USER", "ROLE_ADMIN", "ROLE_MODERATOR"] }, canActivateChild: [authGuardian],
    },
    {
        path: "auth", loadChildren: () => import("./features/pages/auth/auth.routes").then(e => e.routes)
    },
    {
        path: "v1", loadChildren:()=>import("./features/pages/v1/v1.routes").then(e=>e.routes)
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

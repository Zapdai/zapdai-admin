import { CanActivateChildFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "./auth.service";
import { inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

export const authGuardian: CanActivateChildFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);

  if (authService.PossuiToken()) {
    const userPerfis: string[] = authService.getPerfis() || [];
    const perfisPermitidos: string[] = route.data['acess'] || [];

    // Se não há perfis exigidos, apenas estar logado é suficiente
    if (perfisPermitidos.length === 0) return true;

    const temAcesso = perfisPermitidos.some(perfil =>
      userPerfis.includes(perfil)
    );

    if (temAcesso) {
      return true;
    } else {
      if (isBrowser) router.navigate(['/unauthorized']);
      return false;
    }
  } else {
    if (isBrowser) {
      // Salva a URL que o usuário tentou acessar
      const returnUrl = state.url;
      localStorage.setItem('returnUrl', returnUrl);

      // Redireciona para login
      window.location.href = "/auth/signin";
    }
    return false;
  }
};

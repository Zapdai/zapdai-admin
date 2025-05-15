import { CanActivateChildFn, Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

export const authGuardian:CanActivateChildFn = (route)=>{
  const authService = inject(AuthService);
  const router = inject(Router);
  const plat = inject(PLATFORM_ID);
  const br = isPlatformBrowser(plat)
  const isBrowser = isPlatformBrowser(PLATFORM_ID);
  const tokeperfil = "ROLE_ADMIN";

  if (authService.PossuiToken()) {
    // Suponto que authService.getPerfis() retorna string[] com as roles do usuário
    const userPerfis: string[] = authService.getPerfis() || [];
    const perfisPermitidos: string[] = route.data['acess'] || [];

    const temAcesso = perfisPermitidos.some(perfilPermitido =>
      userPerfis.includes(perfilPermitido)
    );

    if (temAcesso) {
      return true;
    } else {
      // Usuário autenticado, mas sem permissão
      if (isBrowser) router.navigate(['/unauthorized']);
      return false;
    }
    } else {
      // Não autenticado
      if (isBrowser) window.location.href = "/home";
      return false;
    }
}
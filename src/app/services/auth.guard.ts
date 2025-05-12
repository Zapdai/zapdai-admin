import { CanActivateChildFn, Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

export const authGuardian:CanActivateChildFn = (route)=>{
     const token = inject(AuthService);
     const rotas = inject(Router);
       const plat = inject(PLATFORM_ID);
       const br = isPlatformBrowser(plat)
     const tokeperfil = "ROLE_ADMIN";
     if(token!.PossuiToken()){
      const perfil = route.data['acess'] as string[]
        if(perfil.some(itens=>tokeperfil.includes(itens))){
         return true;
        }
        return false;
        
     }else{
      if(br){
         window.location.href = "/home"
      }
       
        return false;
     }
}
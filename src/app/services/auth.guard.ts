import { CanActivateChildFn, Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { inject } from "@angular/core";

export const authGuardian:CanActivateChildFn = (route)=>{
     const token = inject(AuthService);
     const rotas = inject(Router);
     const tokeperfil = "ROLE_ADMIN";
     if(token!.PossuiToken()){
      const perfil = route.data['acess'] as string[]
        if(perfil.some(itens=>tokeperfil.includes(itens))){
         return true;
        }
        return false;
        
     }else{
        rotas.navigate(['/categorias'])
        return false;
     }
}
import { CanActivateChildFn, Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { inject } from "@angular/core";

export const authGuardian:CanActivateChildFn = (route)=>{
     const token = inject(AuthService);
     const rotas = inject(Router);
     if(token!.PossuiToken()){
        return true;
        
     }else{
         rotas.navigate(['/categorias'])
        return false;
     }
}
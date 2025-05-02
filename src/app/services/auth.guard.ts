import { Inject } from "@angular/core";
import { CanActivateChildFn, Router } from "@angular/router";
import { AuthService } from "./auth.service";

export const authGuardian:CanActivateChildFn = (route)=>{
     const token = Inject(AuthService);
     const rotas = Inject(Router);
     if(token?.isLogued()){
        return true;
        
     }else{
        return false;
     }
}
import { Injectable } from "@angular/core";

@Injectable({
    providedIn:"root"
})
export class AuthService{
    PossuiToken(){
        return this.returnToken()?true:false;
    }

    returnToken(){
       if(typeof localStorage !== 'undefined'){
            return localStorage.getItem('acessToken')
       }
       return
    }

    RemoveToken(){
        localStorage.removeItem('acessToken')
    }

    saveToken(token:string){
        localStorage.setItem('acessToken', token)
    }
}
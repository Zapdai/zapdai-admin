import { Injectable } from "@angular/core";

@Injectable({
    providedIn:"root"
})
export class nomeService{
    pegaValor(nome:string){
        alert(nome)
    }
}

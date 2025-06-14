import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn:"root"
})
export class ApiCategorias{
    environment = environment;
    constructor(private http:HttpClient){}
    findAllCategorias():Observable<any>{
        return this.http.get<any>(`${this.environment.apiUrl}/categorias/lista`).pipe()
    }
     findAllProdutos():Observable<any>{
        return this.http.get<any>(`${this.environment.apiUrl}/zapdai/v1/empresas/lista`).pipe()
    }
}
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { cadastro } from "../shared/core/types/cadastro";
import { environment } from "../../environments/environment";

@Injectable ({
    providedIn: 'root',

})

export class apiAuthService {
    private apiUrl: string = environment.apiUrl

    constructor (private http:HttpClient) {
        
    }
    login (data:any):Observable <any> {
        return this.http.post<any>(`${this.apiUrl}/zapdai/v1/usuario/auth`, data).pipe()
    }
    signup (data:any):Observable <cadastro> {
        return this.http.post<cadastro>(`${this.apiUrl}/zapdai/v1/usuario/registro`, data).pipe()
    }
     buscaUsuario (email:any):Observable <any> {
      const  data = {email:email}
        return this.http.post<any>(`${this.apiUrl}/zapdai/v1/usuario/search`, data).pipe()
    }
}
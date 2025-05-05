import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { cadastro } from "../shared/core/types/cadastro";

@Injectable ({
    providedIn: 'root',

})

export class apiAuthService {
    apiKey = 'https://zapdaiback.onrender.com/zapdai/v1/usuario'

    constructor (private http:HttpClient) {
        
    }
    login (data:any):Observable <any> {
        return this.http.post<any>(`${this.apiKey}/auth`, data).pipe()
    }
    signup (data:any):Observable <cadastro> {
        return this.http.post<cadastro>(`${this.apiKey}/registro`, data).pipe()
    }
}
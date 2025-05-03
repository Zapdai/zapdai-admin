import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable ({
    providedIn: 'root',

})

export class apiAuthService {
    apiKey = 'https://zapdaiback.onrender.com/zapdai/v1/usuario/auth'

    constructor (private http:HttpClient) {
        
    }
    login (data:any):Observable <any> {
        console.log(data)
        return this.http.post<any>(this.apiKey, data).pipe()
    }
}
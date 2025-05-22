import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { registroEmpresa } from "../../shared/core/registroEmpresa/registroEmpresa";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable ({
    providedIn: 'root',
})

export class registroEmpresaApi {

    private apiUrl = environment.apiUrl

    constructor(private http: HttpClient){}

    registroEmpresa(data: any): Observable<registroEmpresa> {
        return this.http.post<registroEmpresa>(`${this.apiUrl}/zapdai/v1/empresas/registro`, data).pipe()
    }
}
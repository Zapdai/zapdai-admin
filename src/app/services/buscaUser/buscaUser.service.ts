import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";


@Injectable({
    providedIn: "root",
})

export class apiBuscaUserService {
    private urlApi = environment.apiUrl

    constructor(private http: HttpClient) { }

    buscarUsuario(email: string): Observable<any> {
        const data = { email };
        return this.http.post<any>(`${this.urlApi}/zapdai/v1/usuario/busca`, data);
    }

}
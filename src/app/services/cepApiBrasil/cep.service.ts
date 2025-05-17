import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { cep } from "../../shared/core/cepApiBrasil/cep";


@Injectable({
    providedIn: 'root'
})

export class cepApiBrasilService {
    apiCepUrl = environment.apiCepBrasil

    constructor(private http: HttpClient){}

    consultarCep(codCep: any): Observable<cep> {
        return this.http.get<cep>(`${this.apiCepUrl}/${codCep}`)
    }
}
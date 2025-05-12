import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { itensPlanos } from "../../shared/core/Plano/planosItens";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn:"root"
})
export class PlanoService{
    api = environment.apiUrl
    constructor(private http:HttpClient){}
    planosConsumoApi():Observable<itensPlanos>{
        return this.http.get<itensPlanos>(this.api+`/zapdai/v1/planos-current/lista`).pipe()

    }
}
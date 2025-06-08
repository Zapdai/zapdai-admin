import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { functionList } from "../../shared/core/functionList/functionList";

@Injectable({
    providedIn:"root"
})
export class functionListService{
    
    api = environment.apiUrl
    constructor(private http:HttpClient){}
    BuscarFunctionList():Observable<functionList>{
        return this.http.get<functionList>(`${this.api}/funcao/lista`).pipe()

    }
}
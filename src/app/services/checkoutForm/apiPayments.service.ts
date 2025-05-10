import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";


@Injectable({
    providedIn: "root",
})

export class apiPaymentsService {
    private urlApi = environment.apiUrl

    constructor(private http: HttpClient){}


    pagamentoPix(data: any): Observable <any> {
        return this.http.post<any>(`${this.urlApi}/process_payment/v1/access_token?token=APP_USR-162054304887036-050718-6176f4dbe6d6eec4415e2e8ae449190a-614057233`, data).pipe()
        
    }

}
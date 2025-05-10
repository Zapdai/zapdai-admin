import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { PagamentoPix } from "../../shared/core/types/pagamento";
import { Observable } from "rxjs";


@Injectable({
    providedIn: "root",
})

export class apiPaymentsService {
    private urlApi = environment.apiUrl

    constructor(private http: HttpClient){}


    pagamentoPix(data: any): Observable <any> {
        const headers = new HttpHeaders({
            'authToken': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJBUEkgWmFwaWRhaSIsInN1YiI6InN1cG9ydGVAemFwZGFpLmNvbSIsInJvbGVzIjpbIlJPTEVfVVNFUiJdfQ._zQXaIozDVEk7Y4FzsRiMiRihW2sm3WAklGmXi3A2bg', // substitua pelo seu token real
            'Content-Type': 'application/json'
        });

        return this.http.post<any>(`${this.urlApi}/process_payment/v1/access_token?token=APP_USR-162054304887036-050718-6176f4dbe6d6eec4415e2e8ae449190a-614057233`, data, { headers }).pipe()
        
    }

}
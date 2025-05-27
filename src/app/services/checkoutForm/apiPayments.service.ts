import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";


@Injectable({
    providedIn: "root",
})

export class apiPaymentsService {
    private urlApiPayment = environment.apiPaymentUrl

    constructor(private http: HttpClient){}

    
    pagamentoPix(data: any): Observable <any> {
        return this.http.post<any>(`${this.urlApiPayment}/process_payment/v1/access_token?token=APP_USR-162054304887036-050718-6176f4dbe6d6eec4415e2e8ae449190a-614057233`, data).pipe()
        
    }

    pagarComCartao(data: any): Observable <any> {
        return this.http.post<any>(`${this.urlApiPayment}/process_payment/v1/access_token?token=APP_USR-162054304887036-050718-6176f4dbe6d6eec4415e2e8ae449190a-614057233`, data).pipe()
        
    }

    paymentAsaas(data: any): Observable <any> {
        return this.http.post<any>(`${this.urlApiPayment}/v1/payment/zapdai`, data).pipe()
        
    }

    statusPayment(data: any): Observable <any> {
        return this.http.post<any>(`${this.urlApiPayment}/pagamento/v1/one`, data).pipe()        
    }

}
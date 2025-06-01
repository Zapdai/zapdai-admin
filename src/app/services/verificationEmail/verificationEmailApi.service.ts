import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { geraCodeEmail, verificationCodeEmail } from "../../shared/core/verificationEmail/verificationEmail";

@Injectable ({
    providedIn: 'root',
})

export class verificationEmailApi {

    private apiUrl = environment.apiUrl

    constructor(private http: HttpClient){}

    geraCodeEmail(data: any): Observable<geraCodeEmail> {
        return this.http.post<geraCodeEmail>(`${this.apiUrl}/zapdai/v1/usuario/code`, data).pipe()
    }

    verificationCodeEmail(data: any): Observable<verificationCodeEmail> {
        return this.http.post<verificationCodeEmail>(`${this.apiUrl}/zapdai/v1/usuario/verification`, data).pipe()
    }


}
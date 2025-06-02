import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { resetPassword } from "../../shared/core/user/resetPassword";

@Injectable ({
    providedIn: 'root',
})

export class resetPasswordApi {

    private apiUrl = environment.apiUrl

    constructor(private http: HttpClient){}

    resetPassword(data: any): Observable<resetPassword> {
        return this.http.put<resetPassword>(`${this.apiUrl}/zapdai/v1/usuario/newpasswd`, data).pipe()
    }


}
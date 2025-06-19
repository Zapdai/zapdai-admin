import { HttpClient, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: "root"
})
export class ProdutosApiService {
    constructor(public http:HttpClient){}
    api = environment.apiUrl
    cadastroDeProduto(data: any, files: any):Observable<any> {
        const formData = new FormData();
        if (files !== null) {
            if (files && files.length > 0) {
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    formData.append('file', file);
                }
            }
        }
                    formData.append("data", data);

     const resquest = new HttpRequest('POST', `${this.api}/zapdai/v1/produtos`, formData, { reportProgress: true, responseType: "json" });
    return this.http.request<any>(resquest).pipe();
    }
 }
import { HttpClient, HttpEventType, HttpParams, HttpRequest, HttpResponse } from "@angular/common/http";
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
                    formData.append("data", JSON.stringify(data));



        return this.http.post<any>(`${this.api}/zapdai/v1/produtos`,formData, { responseType: 'text' as any } ).pipe();

    }
    ProdutoEmpresa(idEmpresa:any):Observable<any> {
        const params = new HttpParams()
        .set("id",idEmpresa);
    
        return this.http.get<any>(`${this.api}/zapdai/v1/empresas/produtos`,{params}).pipe();
    }
    }

import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class ApiV1Loja {
    environment = environment;
    constructor(private http: HttpClient) { }
    findAllCategorias(): Observable<any> {
        return this.http.get<any>(`${this.environment.apiUrl}/categorias/lista`).pipe()
    }
    findAllProdutos(): Observable<any> {
        return this.http.get<any>(`${this.environment.apiUrl}/zapdai/v1/empresas/lista`).pipe()
    }
    findOneProdutoCategoria(nome: string): Observable<any> {
        const params = new HttpParams()
            .set("nome", nome)
        return this.http.get<any>(`${this.environment.apiUrl}/zapdai/v1/empresas/categorias`, { params }).pipe()
    }
    findOneProduto(idProduto: number): Observable<any> {
        return this.http.get<any>(`${this.environment.apiUrl}/zapdai/v1/produtos/unit/${idProduto}`).pipe()
    }

    findAllProdutosEmpresa(idEmpresa: string): Observable<any> {
        const params = new HttpParams().set("id", idEmpresa);
        return this.http.get<any>(`${this.environment.apiUrl}/zapdai/v1/empresas/produtos`, { params });
    }
}

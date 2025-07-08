import { HttpClient, HttpEventType, HttpParams, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { PedidoType } from "../../shared/core/pedidos/pedidos";

@Injectable({
    providedIn: "root"
})
export class PedidosService {
    constructor(public http: HttpClient) { }
    api = environment.apiUrl

    criarPedido(data: PedidoType,): Observable<PedidoType> {
        return this.http.post<PedidoType>(`${this.api}/zapdai/v1/pedidos/Current`, data).pipe();
    }
}

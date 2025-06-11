import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { functionList } from "../../shared/core/functionList/functionList";

@Injectable({
    providedIn: "root"
})
export class avatarUserService {

    api = environment.apiUrl
    constructor(private http: HttpClient) { }
    UpdateAvatarUser(id: any, file: any): Observable<any> {
        const formData = new FormData();
        formData.append('id', id);
        formData.append('file', file);

        return this.http.put<any>(`${this.api}/zapdai/v1/usuario/avatar`, formData);
    }
}
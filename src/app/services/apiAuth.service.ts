import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Inject, inject, Injectable, PLATFORM_ID } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { cadastro } from "../shared/core/types/cadastroUpdateUser";
import { environment } from "../../environments/environment";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { AuthDecodeService } from "./AuthUser.service";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
    providedIn: 'root',

})

export class apiAuthService {
    private apiUrl: string = environment.apiUrl;
    public $refreshtoken = new Subject<boolean>;

    constructor(private http: HttpClient, private router: Router, private auth: AuthDecodeService, @Inject(PLATFORM_ID) private platformId: Object,) {
        this.$refreshtoken.subscribe((resposta: any) => {
            if (resposta != null) {
                this.refleshToken();
            }
        })

    }
    login(data: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/zapdai/v1/usuario/auth`, data).pipe()
    }
    signup(data: any): Observable<cadastro> {
        return this.http.post<cadastro>(`${this.apiUrl}/zapdai/v1/usuario/registro`, data).pipe()
    }
    buscaUsuario(email: any): Observable<any> {
        const data = { email: email }
        return this.http.post<any>(`${this.apiUrl}/zapdai/v1/usuario/search`, data).pipe()
    }

    updateUsuario(data: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/zapdai/v1/usuario/address`, data).pipe()
    }

    signinCodeWhatsapp(data: any, token: string): Observable<any> {
        const h = new HttpParams().set("tokenkey", token)

        return this.http.put<any>(
            `${this.apiUrl}/zapdai/v1/usuario/usuario-code`,
            data,
            { params: h }
        );
    }


    sendCodeWhatsapp(data: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/zapdai/v1/usuario/envio-code`, data).pipe()
    }

    refleshToken() {
        const refleshToken = localStorage.getItem("refreshToken")
        const dataResposta = {
            usuarioId: this.auth.getusuarioId(),
            refreshToken: refleshToken
        }
        this.http.post<any>(
            `${this.apiUrl}/zapdai/v1/usuario/refreshToken`,
            dataResposta
        ).subscribe((resposta => {
            if (resposta.acessToken) {
                localStorage.setItem("acessToken", resposta.acessToken)
                if (isPlatformBrowser(this.platformId)) {
                    window.location.href = "/";
                }
            }
        }));
    }
}
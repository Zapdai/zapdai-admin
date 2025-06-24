/* eslint-disable @typescript-eslint/no-unused-vars */
import { Observable, catchError, throwError } from "rxjs";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { SnackService } from "../services/snackBar/snack.service";

@Injectable()
export class AuthInterceptors implements HttpInterceptor {
  constructor(private auth: AuthService, private router: Router, private dialog: SnackService) { }



  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const rotasPublicas = [
      '/auth/signup',
      '/auth/signin',
      '/auth/resetPassword',
      '/planos',
      '/home',
      '/zapdai/v1/usuario/verification',
      '/zapdai/v1/usuario/code',
      '/zapdai/v1/usuario/newpasswd ',
      '/categorias/lista',
      '/zapdai/v1/empresas/lista',
      '/zapdai/v1/produtos/unit/'

    ];

    // Melhor usar URL completa e comparar com `startsWith` ou usar Regex se necessário
    const isPublicRoute = rotasPublicas.some((rota) => request.url.includes(rota));

    if (this.auth.PossuiToken() && !isPublicRoute) {
      const token = this.auth.returnToken();

      if (token) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const status = error.status;
    const mensagemErro = error?.error?.erro || status + " Bad Gateway";
         const mensagensExtras: Record<number, string> = {
      403: 'Acesso negado. Você não tem permissão para executar esta ação.'
    };

    // Status que devem abrir snackbar
    const handledStatuses = [400, 401, 403, 501, 502, 503, 504];

    if (handledStatuses.includes(status)) {
      this.dialog.openSnackBar(mensagemErro);

      if (mensagensExtras[status]) {
        this.dialog.openSnackBar(mensagensExtras[status]);
      }
    }

        return throwError(() => new Error(error.message));
      })

    );


    // return next.handle(request).pipe(
    //   catchError((error: HttpErrorResponse) => {
    //     /*if (error.status === 500 ) {
    //       this.authApi.$refreshtoken.next(true);

    //           // this.dialog.open(ConfirmComponent);
    //     }*/
    //     if (error.status === 400) {
    //       this.dialog.openSnackBar(error?.error.erro)

    //     }
    //     if (error.status === 401) {
    //       this.dialog.openSnackBar(error?.error.erro)

    //     }
    //     if (error.status === 403) {
    //       this.dialog.openSnackBar(error?.error.erro)
    //       this.dialog.openSnackBar('Acesso negado. Você não tem permissão para executar esta ação.');
    //     }
    //     if (error.status === 501) {
    //       this.dialog.openSnackBar(error?.error.erro)
    //     }
    //     else if (error.status === 502) {
    //       this.dialog.openSnackBar(error?.error.erro)
    //     }
    //     else if (error.status === 503) {
    //       this.dialog.openSnackBar(error?.error.erro)
    //     }
    //     else if (error.status === 504) {
    //       this.dialog.openSnackBar(error?.error.erro)
    //     }
    //     return throwError(error.message);
    //   })
    // );
  }
}
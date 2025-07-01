import { Observable, catchError, throwError } from "rxjs";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { SnackService } from "../services/snackBar/snack.service";

@Injectable()
export class AuthInterceptors implements HttpInterceptor {
  constructor(
    private auth: AuthService,
    private router: Router,
    private dialog: SnackService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
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
      '/zapdai/v1/produtos/unit/',
      '/zapdai/v1/usuario/usuario-code',
      '/zapdai/v1/usuario/envio-code',
      '/produto/detalhes/:id'
    ];

    const isPublicRoute = rotasPublicas.some((rota) =>
      request.url.includes(rota)
    );

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
        const mensagemErro =
          error?.error?.message || error?.error?.erro || status + " Bad Gateway";

        const mensagensExtras: Record<number, string> = {
          403: 'Acesso negado. Você não tem permissão para executar esta ação.'
        };

        const handledStatuses = [400, 401, 403, 501, 502, 503, 504];

        if (handledStatuses.includes(status)) {
          // Exibe a mensagem retornada pela API (se for 400 e tiver .message)
          if (status === 400 && error?.error?.message) {
            this.dialog.error(error.error.message);
          } else {
            this.dialog.error(mensagemErro);
          }

          if (mensagensExtras[status]) {
            this.dialog.error(mensagensExtras[status]);
          }
        }

        return throwError(() => new Error(error.message));
      })
    );
  }
}

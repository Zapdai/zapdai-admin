/* eslint-disable @typescript-eslint/no-unused-vars */
import { Observable, catchError, throwError } from "rxjs";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable()
export class AuthInterceptors implements HttpInterceptor {
  constructor(private auth: AuthService, private router: Router, private dialog: MatDialog) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    /*if (this.auth.PossuiToken() && !request.url.includes('/refreshToken')) {
      request = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${this.auth.returnToken()}`
        }
      });
    }*/
   

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        /*if (error.status === 500 ) {
          this.authApi.$refreshtoken.next(true);

              // this.dialog.open(ConfirmComponent);
        }*/
        if (error.status === 401) {
        alert(error?.error.erro)
        }
        if(error.status === 400){
          /*this.snackBar.openSnackBar(error.error.msg);*/
          alert('Error msg')

        }
        if (error.status === 501) {
          //this.snackBar.openSnackBar("Erro 501 serviço em manutenção");
          alert('Erro 501 serviço em manutenção')
        }
        else if (error.status === 502) {
          //this.snackBar.openSnackBar("Erro 502 Bad Gateway");
          alert('Erro 502 Bad Gateway')          
        }
        else if (error.status === 503) {
          //this.snackBar.openSnackBar("Erro 503 serviço indisponivel");
          alert('Erro 503 serviço indisponivel')          
        }
        else if (error.status === 504) {
          //this.snackBar.openSnackBar("Gateway Timeout: Erro 504 serviço em manutenção");
          alert('Gateway Timeout: Erro 504 serviço em manutenção')          
        }
        return throwError(error.message);
      })
    );
  }
}
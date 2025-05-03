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
        this.dialog.openSnackBar(error?.error.erro)

        }
        if(error.status === 400){
          this.dialog.openSnackBar(error?.error.erro)

        }
        if (error.status === 501) {
          this.dialog.openSnackBar(error?.error.erro)
        }
        else if (error.status === 502) {
          this.dialog.openSnackBar(error?.error.erro)
        }
        else if (error.status === 503) {
          this.dialog.openSnackBar(error?.error.erro)
        }
        else if (error.status === 504) {
          this.dialog.openSnackBar(error?.error.erro)
        }
        return throwError(error.message);
      })
    );
  }
}
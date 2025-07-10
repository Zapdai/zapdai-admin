/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { Router } from "@angular/router";
import { apiAuthService } from "../../../services/apiAuth.service";
import { AuthService } from "../../../services/auth.service";
import { AuthDecodeService } from "../../../services/AuthUser.service";

@Component({
    selector:"app-confirm",
    standalone:true,
    imports: [MatDialogModule,MatDialogTitle,MatIconModule, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
    templateUrl:"./confirm.component.html",
    styleUrl:"./confirm.component.scss"
})
export class ConfirmComponent implements OnInit{
    ativo?: boolean;
     userName?: any;
    constructor(private authApi: apiAuthService,private router: Router,private auth: AuthService ,private authUser:AuthDecodeService){
       
    }
    ngOnInit(): void {
        this.userName = this.authUser.getName();
    }

    Confirmar(){
        this.ativo = true;
        this.ativar(this.ativo);
        this.router.navigate(["/"]);
    }
    cancelar(){
        this.ativo = false;
        this.auth.RemoveToken();
        this.auth.RemoveRefreshToken();
        window.location.reload();
        this.ativar(this.ativo);
      

    }

    ativar(alert: boolean){
        this.authApi.$refreshtoken.next(alert);
    }
  
}
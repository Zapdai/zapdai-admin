import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormLoginComponent } from "../../../../shared/component/form-login/form-login.component";
import { Router } from "@angular/router";
import { loadingService } from "../../../../services/loading/loading.service";
import { formModalComponent } from "../../../../shared/component/formModal/formModal.component";
import { FormSigninCodWhatsappComponent } from "./form-signinCodWhatsapp/form-signinCodWhatsapp.component";

@Component ({
    selector:'',
    standalone: true,
    templateUrl:'./signinCodWhatsapp.component.html',
    styleUrl:'./signinCodWhatsapp.component.scss',
    imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule, formModalComponent, FormSigninCodWhatsappComponent]
})

export class SigninCodWhatsappComponent {

    constructor ( private router:Router, private activeRoute:loadingService){
    }

    pageCategorias(){
        this.activeRoute.activeLoading()
        setTimeout(() => {
            this.router.navigateByUrl('/loading', { skipLocationChange: true}).then(()=>{
                setTimeout(() => {
                    this.router.navigate(['/'])
                }, 1000);
            })
            
        }, 0);
    }
}
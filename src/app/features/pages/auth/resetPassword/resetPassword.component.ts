import { Component } from "@angular/core";
import { loadingService } from "../../../../services/loading/loading.service";
import { Router } from "@angular/router";
import { apiAuthService } from "../../../../services/apiAuth.service";
import { cadastro } from "../../../../shared/core/types/cadastroUpdateUser";
import { SnackService } from "../../../../services/snackBar/snack.service";
import { FormResetPasswordComponent } from "../../../../shared/component/form-resetPassword/form-resetPassword.component";

@Component({
    selector:"app-resetPassword",
    standalone:true,
    templateUrl:"./resetPassword.component.html",
    styleUrl:"./resetPassword.component.scss",
    imports: [FormResetPasswordComponent]
})
export class ResetPasswordComponent{
    
    constructor ( private router:Router, private activeRoute:loadingService,public auth:apiAuthService,private snack:SnackService){
    }

    pageHome(){
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
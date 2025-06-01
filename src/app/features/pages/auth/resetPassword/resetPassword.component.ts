import { Component } from "@angular/core";
import { loadingService } from "../../../../services/loading/loading.service";
import { Router } from "@angular/router";
import { apiAuthService } from "../../../../services/apiAuth.service";
import { cadastro } from "../../../../shared/core/types/cadastro";
import { SnackService } from "../../../../services/snackBar/snack.service";
import { registroForm } from "../../../../services/singNupForm/registroForm.servide";
import { FormResetPasswordComponent } from "../../../../shared/component/form-resetPassword/form-resetPassword.component";

@Component({
    selector:"app-resetPassword",
    standalone:true,
    templateUrl:"./resetPassword.component.html",
    styleUrl:"./resetPassword.component.scss",
    imports: [FormResetPasswordComponent]
})
export class ResetPasswordComponent{
    
    constructor ( private router:Router, private activeRoute:loadingService,public auth:apiAuthService,private snack:SnackService,private form:registroForm){
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

     // precisa ser feito mais um Slider para validaçao de Codigo enviado ao email
      enviar(event:cadastro){
        if(event!=null){
           this.auth.signup(event).subscribe((e:any)=>{
               const msg:any =JSON.stringify(e)
             if(e?.OK){
                this.snack.openSnackBar(e?.OK);
                this.form.groupform.reset();
                this.router.navigate(['/auth/signin']);
             }
           })
        }

      }
}
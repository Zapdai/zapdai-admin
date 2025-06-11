import { Component } from "@angular/core";
import { FormSignupComponent } from "../../../../shared/component/form-signup/form-signup.component";
import { loadingService } from "../../../../services/loading/loading.service";
import { Router } from "@angular/router";
import { apiAuthService } from "../../../../services/apiAuth.service";
import { cadastro } from "../../../../shared/core/types/cadastroUpdateUser";
import { SnackService } from "../../../../services/snackBar/snack.service";
import { registroForm } from "../../../../services/singNupForm/registroForm.servide";
import { PageContainerComponent } from "../../../../shared/component/page-container/page-container.component";

@Component({
    selector:"app-registro",
    standalone:true,
    templateUrl:"./signup.component.html",
    styleUrl:"./signup.component.scss",
    imports: [FormSignupComponent, PageContainerComponent]
})
export class SignupComponent{
    
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
                this.snack.success(e?.OK);
                this.form.groupform.reset();
                this.router.navigate(['/auth/signin']);
             }
           })
        }

      }
}
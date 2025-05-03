import { Component } from "@angular/core";
import { formModalComponent } from "../../../../shared/component/formModel/formModal.component";
import { footerComponent } from "../../home/foother/footer.component";
import { FormSignupComponent } from "../../../../shared/component/form-signup/form-signup.component";
import { loadingService } from "../../../../services/loading/loading.service";
import { Router } from "@angular/router";

@Component({
    selector:"app-registro",
    standalone:true,
    templateUrl:"./signup.component.html",
    styleUrl:"./signup.component.scss",
    imports: [formModalComponent, footerComponent, FormSignupComponent]
})
export class SignupComponent{
    
    constructor ( private router:Router, private activeRoute:loadingService){
    }

    pageCategorias(){
        this.activeRoute.activeLoading()
        setTimeout(() => {
            this.router.navigateByUrl('/loading', { skipLocationChange: true}).then(()=>{
                setTimeout(() => {
                    this.router.navigate(['/categorias'])
                }, 1000);
            })
            
        }, 0);
      }
}
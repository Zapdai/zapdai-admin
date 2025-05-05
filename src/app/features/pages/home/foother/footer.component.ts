import { Component } from "@angular/core";
import { loadingService } from "../../../../services/loading/loading.service";
import { Router } from "@angular/router";

@Component({
    selector:"app-footer",
    standalone:true,
    templateUrl:"./footer.component.html",
    styleUrl:"./footer.component.scss",
    imports:[]
})
export class footerComponent{
    
    constructor(private router:Router,private activeRouter:loadingService){}

    pageSignup(){
        this.activeRouter.activeLoading()
        setTimeout(() => {
            this.router.navigateByUrl('/loading', { skipLocationChange: true }).then(() => {
              setTimeout(() => {
                this.router.navigate(['/auth/signup']);
              }, 1000);
            });
          }, 0);
    }
    
    pageSignin(){
        this.activeRouter.activeLoading()
        setTimeout(() => {
            this.router.navigateByUrl('/loading', { skipLocationChange: true}).then(()=>{
                setTimeout(() => {
                    this.router.navigate(['/auth/signin'])
                }, 1000);
            })
            
        }, 0);
    }
}
import { Component, Input } from "@angular/core";
import { loadingService } from "../../../../services/loading/loading.service";
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
    selector:"app-footer",
    standalone:true,
    templateUrl:"./footer.component.html",
    styleUrl:"./footer.component.scss",
    imports:[CommonModule,RouterLink]
})
export class footerComponent{
    
    constructor(private router:Router,private activeRouter:loadingService){}

    @Input() footerActive = false
    @Input() color?: string;

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
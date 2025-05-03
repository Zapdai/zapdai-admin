import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { footerComponent } from "../../home/foother/footer.component";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormLoginComponent } from "../../../../shared/component/form-login/form-login.component";
import { formModalComponent } from "../../../../shared/component/formModel/formModal.component";
import { Router } from "@angular/router";
import { loadingService } from "../../../../services/loading/loading.service";

@Component ({
    selector:'',
    standalone: true,
    templateUrl:'./signin.component.html',
    styleUrl:'./signin.component.scss',
    imports: [CommonModule, ReactiveFormsModule, footerComponent, MatSnackBarModule, FormLoginComponent, formModalComponent]
})

export class SigninComponent {

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
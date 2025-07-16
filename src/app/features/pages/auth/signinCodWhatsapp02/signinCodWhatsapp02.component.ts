import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from "@angular/router";
import { loadingService } from "../../../../services/loading/loading.service";
import { formModalComponent } from "../../../../shared/component/formModal/formModal.component";
import { RouterOutlet } from "@angular/router";

@Component ({
    selector:'',
    standalone: true,
    templateUrl:'./signinCodWhatsapp02.component.html',
    styleUrl:'./signinCodWhatsapp02.component.scss',
    imports: [CommonModule, RouterOutlet, ReactiveFormsModule, MatSnackBarModule, formModalComponent]
})

export class SigninCodWhatsapp02Component {

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
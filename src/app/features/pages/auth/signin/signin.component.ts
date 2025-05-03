import { Component } from "@angular/core";
import { loginFormService } from "../../../../services/loginService/loginForm.servide";
import { CommonModule } from "@angular/common";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { apiAuthService } from "../../../../services/apiAuth.service";
import { Router } from "@angular/router";
import { loadingService } from "../../../../services/loading/loading.service";
import { AuthService } from "../../../../services/auth.service";
import { footerComponent } from "../../home/foother/footer.component";
import { SnackService } from "../../../../services/snackBar/snack.service";
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component ({
    selector:'',
    standalone: true,
    templateUrl:'./signin.component.html',
    styleUrl:'./signin.component.scss',
    imports:[CommonModule,ReactiveFormsModule, footerComponent,MatSnackBarModule]
})

export class SigninComponent {
    constructor (public service:loginFormService, private auth:apiAuthService, private router:Router, private activeRoute:loadingService, private authService:AuthService,private snack:SnackService){
    }

    select <T> (name:string){
        const form = this.service.groupform.get(name)

        if(!form) {
            throw new Error('Nome inválido!!!')
        }
        return form as FormControl
    }

    data ():any {
        const dataName = {
            email: this.select('email').value,
            password: this.select('password').value
        }
        return dataName
    }

    btn (){
        this.auth.login(this.data()).subscribe(item=>{
            if(item.authToken !== null){
                this.authService.saveToken(item.authToken)
                this.router.navigateByUrl('/home')
            }
        })
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


pageSignup(){
    this.activeRoute.activeLoading()
    setTimeout(() => {
        this.router.navigateByUrl('/loading', { skipLocationChange: true }).then(() => {
          setTimeout(() => {
            this.router.navigate(['/auth/signup']);
          }, 1000);
        });
      }, 0);
}

isRequiredEmail(){
    return this.service.groupform.get('email')?.errors?.['required'] && this.service.groupform.get('email')?.touched
}

isRequiredPassword(){
    return this.service.groupform.get('password')?.errors?.['required'] && this.service.groupform.get('password')?.touched
}

}
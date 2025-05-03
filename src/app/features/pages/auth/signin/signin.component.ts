import { Component } from "@angular/core";
import { loginFormService } from "../../../../services/loginService/loginForm.servide";
import { CommonModule } from "@angular/common";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { apiAuthService } from "../../../../services/apiAuth.service";
import { Router } from "@angular/router";
import { loadingService } from "../../../../services/loading/loading.service";

@Component ({
    selector:'',
    standalone: true,
    templateUrl:'./signin.component.html',
    styleUrl:'./signin.component.scss',
    imports:[CommonModule,ReactiveFormsModule]
})

export class SigninComponent {
    constructor (public service:loginFormService, private auth:apiAuthService, private router:Router, private activeRoute:loadingService){
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
            senha: this.select('senha').value
        }
        return dataName
    }

    btn (){
        this.auth.login(this.data()).subscribe(item=>{
            console.log('Meu token ' + item.authToken)
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
}
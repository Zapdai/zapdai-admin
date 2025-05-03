import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { apiAuthService } from '../../../services/apiAuth.service';
import { AuthService } from '../../../services/auth.service';
import { loadingService } from '../../../services/loading/loading.service';
import { loginFormService } from '../../../services/loginService/loginForm.servide';
import { SnackService } from '../../../services/snackBar/snack.service';

@Component({
  selector: 'app-form-login',
  imports:[CommonModule,ReactiveFormsModule,MatSnackBarModule],
  templateUrl: './form-login.component.html',
  styleUrl: './form-login.component.scss'
})
export class FormLoginComponent {
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
perfil = "admin"
  btn (){
      this.auth.login(this.data()).subscribe(item=>{
          if(item.authToken !== null){
            this.authService.saveToken(item.authToken)
            if(this.perfil.includes("admin")){
              this.router.navigateByUrl('/home')
            }else if(this.perfil.includes("user")){
              this.router.navigateByUrl('/categorias')
            }      
          }
      })
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

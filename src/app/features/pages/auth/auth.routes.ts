import { Routes } from "@angular/router";
import { SignupComponent } from "./signup/signup.component";
import { SigninComponent } from "./signin/signin.component";
import { ResetPasswordComponent } from "./resetPassword/resetPassword.component";

export const routes:Routes = [
    {
        path:"signup",component:SignupComponent,title:"Signup"
    },
    {
        path:"signin",component:SigninComponent,title:"Signin"
    },
    {
        path:"resetPassword",component:ResetPasswordComponent,title:"Reset Password"
    }
]
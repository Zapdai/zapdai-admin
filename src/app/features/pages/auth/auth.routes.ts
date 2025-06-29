import { Routes } from "@angular/router";
import { SignupComponent } from "./signup/signup.component";
import { SigninComponent } from "./signin/signin.component";
import { ResetPasswordComponent } from "./resetPassword/resetPassword.component";
import { SigninCodWhatsappComponent } from "./signinCodWhatsapp/signinCodWhatsapp.component";

export const routes:Routes = [
    {
        path:"signup",component:SignupComponent,title:"Cadastro de Usuário - Zapdai"
    },
    {
        path:"signin",component:SigninComponent,title:"Tela de Login - Zapdai"
    },
    {
        path:"signincodwhatsapp",component:SigninCodWhatsappComponent,title:"Login Por Telefone - Zapdai"
    },
    {
        path:"resetPassword",component:ResetPasswordComponent,title:"Resete de Senha - Zapdai"
    }
]
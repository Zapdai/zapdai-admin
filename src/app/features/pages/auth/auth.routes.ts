import { Routes } from "@angular/router";
import { SignupComponent } from "./signup/signup.component";
import { SigninComponent } from "./signin/signin.component";
import { ResetPasswordComponent } from "./resetPassword/resetPassword.component";
import { SigninCodWhatsappComponent } from "./signinCodWhatsapp/signinCodWhatsapp.component";
import { SigninCodWhatsapp02Component } from "./signinCodWhatsapp02/signinCodWhatsapp02.component";
import { SendCodeWhatsappComponent } from "./signinCodWhatsapp02/sendCodeWhatsapp/sendCodeWhatsapp.component";
import { AuthSigninCodeWhatsappComponent } from "./signinCodWhatsapp02/authSigninCodeWhatsapp/authSigninCodeWhatsapp.component";

export const routes: Routes = [
    {
        path: "signup", component: SignupComponent, title: "Cadastro de Usuário - Zapdai"
    },
    {
        path: "signin", component: SigninComponent, title: "Tela de Login - Zapdai"
    },
    {
        path: "signincodwhatsapp", component: SigninCodWhatsappComponent, title: "Login Por Telefone - Zapdai"
    },
    {
        path: "resetPassword", component: ResetPasswordComponent, title: "Resete de Senha - Zapdai"
    },
    {
        path: "signincode", component: SigninCodWhatsapp02Component, title: "Login Por Telefone - Zapdai", children: [
            {
                path: "", component: SendCodeWhatsappComponent 
            },
            
            {
                path: "autentication", component: AuthSigninCodeWhatsappComponent
            }
    ]}
]
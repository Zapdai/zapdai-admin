import { Injectable } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { validaToken } from "../validaToken/validaToken.service";

@Injectable({
    providedIn:"root"
})

export class CheckoutFormService {
    checkoutForm = new FormGroup({
        NomeCompleto: new FormControl("",Validators.required),
        email: new FormControl("",[Validators.email, Validators.required]),
        typeCpfCnpj: new FormControl("",Validators.required),
        cpfCnpj: new FormControl("",Validators.required),
        cardNumber: new FormControl("",Validators.required),
        mesAno: new FormControl("",Validators.required),
        cvv: new FormControl("",Validators.required),
    })
}
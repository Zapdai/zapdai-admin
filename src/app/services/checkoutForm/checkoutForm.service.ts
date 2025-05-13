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
        cpfCnpj: new FormControl("",[Validators.required, Validators.minLength(11)]),
        cardNumber: new FormControl("",[Validators.required, Validators.minLength(14)]),
        mes: new FormControl("",[Validators.required, Validators.minLength(2)]),
        ano: new FormControl("",[Validators.required, Validators.minLength(4)]),
        cvv: new FormControl("",[Validators.required, Validators.minLength(3)]),
    })
}
import { Injectable } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { validaToken } from "../validaToken/validaToken.service";
import { cartaoValidator, cpfOuCnpjValidator, validarCep, validarEmail } from "../../../validators";

@Injectable({
    providedIn:"root"
})
export class CheckoutFormService {
    checkoutForm = new FormGroup({
        NomeCompleto: new FormControl("",Validators.required),
        email: new FormControl("",[Validators.email, Validators.required, validarEmail]),
        typeCpfCnpj: new FormControl("",Validators.required),
        cpfCnpj: new FormControl("",[Validators.required, Validators.minLength(11), cpfOuCnpjValidator]),
        cardNumber: new FormControl("",[Validators.required, Validators.minLength(14), cartaoValidator]),
        mes: new FormControl("",[Validators.required, Validators.minLength(2)]),
        ano: new FormControl("",[Validators.required, Validators.minLength(4)]),
        cvv: new FormControl("",[Validators.required, Validators.minLength(3)]),
        installments: new FormControl("1", Validators.required),
        cep: new FormControl ('', [Validators.required, validarCep]),
        estado: new FormControl ('', Validators.required),
        cidade: new FormControl ('', Validators.required),
        bairro: new FormControl ('', Validators.required),
        rua: new FormControl ('', Validators.required),
        numeroEndereco: new FormControl ('', Validators.required),
        complemento: new FormControl ('', Validators.required),
        phone: new FormControl ('', Validators.required),
    })
}
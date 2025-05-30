import { Injectable } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { validarCep, validarEmail } from "../../../validators";

@Injectable ({
    providedIn:'root'
})

export class resetPasswordForm {
    passwordform = new FormGroup ({
        email: new FormControl ('', [Validators.required, Validators.email, validarEmail]),
        otp: new FormControl('', [Validators.required, Validators.minLength(6)]),
        password: new FormControl ('', Validators.required),
        repeatPassword: new FormControl ('', Validators.required)
    }) 

    


}
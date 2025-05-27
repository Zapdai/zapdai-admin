import { Injectable } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { validarEmail } from "../../../validators";

@Injectable ({
    providedIn:'root'
})

export class loginFormService {
    groupform = new FormGroup ({
        email: new FormControl ('', [Validators.required, Validators.email, validarEmail]),
        password: new FormControl ('', [Validators.required, Validators.minLength(8)])
    }) 

    


}
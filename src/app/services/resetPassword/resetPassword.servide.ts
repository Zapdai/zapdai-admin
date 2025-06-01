import { Injectable } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { senhaIguaisValidator, senhaValidator, validarCep, validarEmail } from "../../../validators";

@Injectable({
    providedIn: 'root'
})

export class resetPasswordForm {
    passwordform = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email, validarEmail]),
        code: new FormControl('', [Validators.required, Validators.minLength(6)]),
        password: new FormControl('', [Validators.required, senhaValidator]),
        repeatPassword: new FormControl('', Validators.required)
  }, { validators: senhaIguaisValidator });




}
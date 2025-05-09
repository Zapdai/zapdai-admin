import { Injectable } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { validaToken } from "../validaToken/validaToken.service";

@Injectable({
    providedIn:"root"
})

export class CheckoutFormService {
    checkoutForm = new FormGroup({
        email: new FormControl("",[Validators.email, Validators.required])
    })
}
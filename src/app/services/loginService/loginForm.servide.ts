import { Injectable } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Injectable ({
    providedIn:'root'
})

export class loginFormService {
    groupform = new FormGroup ({
        email: new FormControl ('', [Validators.required, Validators.email]),
        password: new FormControl ('', [Validators.required, Validators.minLength(8)])
    }) 

    


}
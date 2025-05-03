import { Injectable } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

@Injectable ({
    providedIn:'root'
})

export class loginFormService {
    groupform = new FormGroup ({
        email: new FormControl (''),
        senha: new FormControl ('')
    }) 

    


}
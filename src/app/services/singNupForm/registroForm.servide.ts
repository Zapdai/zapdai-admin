import { Injectable } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { cpfOuCnpjValidator, validarEmail } from "../../../validators";

@Injectable ({
    providedIn:'root'
})

export class registroForm {
    groupform = new FormGroup ({
        name: new FormControl ('', Validators.required),
        telefone: new FormControl ('', Validators.required),
        sexo: new FormControl ('', Validators.required),
        email: new FormControl ('', [Validators.required, Validators.email, validarEmail]),
        cpf: new FormControl ('', [Validators.required, Validators.minLength(11), cpfOuCnpjValidator]),
        dataNascimento: new FormControl ('', Validators.required),
        password: new FormControl ('', Validators.required),
        repeteSenha: new FormControl ('', Validators.required)
    }) 

    


}
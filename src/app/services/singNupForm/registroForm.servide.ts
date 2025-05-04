import { Injectable } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Injectable ({
    providedIn:'root'
})

export class registroForm {
    groupform = new FormGroup ({
        name: new FormControl ('', Validators.required),
        telefone: new FormControl ('', Validators.required),
        sexo: new FormControl ('', Validators.required),
        email: new FormControl ('', [Validators.required, Validators.email]),
        cpf: new FormControl ('', [Validators.required, Validators.minLength(11)]),
        dataNascimento: new FormControl ('', Validators.required),
        password: new FormControl ('', Validators.required),
        repeteSenha: new FormControl ('', Validators.required)
    }) 

    


}
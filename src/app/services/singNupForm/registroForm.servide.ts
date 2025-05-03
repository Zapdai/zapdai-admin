import { Injectable } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Injectable ({
    providedIn:'root'
})

export class loginFormService {
    groupform = new FormGroup ({
        nome: new FormControl ('', [Validators.required, Validators.email]),
        telefone: new FormControl ('', [Validators.required]),
        email: new FormControl ('', [Validators.required, Validators.email]),
        cpf: new FormControl ('', [Validators.required, Validators.minLength(11)]),
        sexo: new FormControl ('', [Validators.required]),
        dataNascimento: new FormControl ('', [Validators.required, Validators.minLength(13)]),
        senha: new FormControl ('', [Validators.required]),
        repeteSenha: new FormControl ('', [Validators.required])
    }) 

    


}
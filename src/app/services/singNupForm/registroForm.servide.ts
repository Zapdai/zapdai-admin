import { Injectable } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Injectable ({
    providedIn:'root'
})

export class loginFormService {
    groupform = new FormGroup ({
        nome: new FormControl ('abc', Validators.required),
        telefone: new FormControl ('abc', Validators.required),
        email: new FormControl ('abc', [Validators.required, Validators.email]),
        cpf: new FormControl ('abc', [Validators.required, Validators.minLength(11)]),
        sexo: new FormControl ('abc', Validators.required),
        dataNascimento: new FormControl ('abc', Validators.required),
        senha: new FormControl ('abc', Validators.required),
        repeteSenha: new FormControl ('abc', Validators.required)
    }) 

    


}
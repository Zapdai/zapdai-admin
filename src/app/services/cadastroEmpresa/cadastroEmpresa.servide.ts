import { Injectable } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Injectable ({
    providedIn:'root'
})

export class cadastroEmpresaForm {
    empresaform = new FormGroup ({
        nomeCompania: new FormControl ('', Validators.required),
        numeroDeTelefone: new FormControl ('', Validators.required),
        email: new FormControl ('', [Validators.required, Validators.email]),
        cep: new FormControl ('', Validators.required),
        estado_sigla: new FormControl ('', Validators.required),
        cidade: new FormControl ('', Validators.required),
        bairro: new FormControl ('', Validators.required),
        rua: new FormControl ('', Validators.required),
        numeroEndereco: new FormControl ('', Validators.required),
        complemento: new FormControl ('', Validators.required),
        cpfResposavel: new FormControl ('', Validators.required),
        razaoSocial: new FormControl ('', Validators.required),
        cnpj: new FormControl ('', Validators.required)
    }) 

    


}
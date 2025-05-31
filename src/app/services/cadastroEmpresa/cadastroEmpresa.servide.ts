import { Injectable } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { cpfOuCnpjValidator, validarCep, validarEmail } from "../../../validators";

@Injectable({
    providedIn: 'root'
})

export class cadastroEmpresaForm {
    empresaform = new FormGroup({
        nomeCompania: new FormControl('', Validators.required),
        numeroDeTelefone: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email, validarEmail]),
        cep: new FormControl('', [Validators.required, validarCep]),
        estado_sigla: new FormControl('', Validators.required),
        cidade: new FormControl('', Validators.required),
        bairro: new FormControl('', Validators.required),
        rua: new FormControl('', Validators.required),
        numeroEndereco: new FormControl('', Validators.required),
        complemento: new FormControl('', Validators.required),
        cpfCnpj: new FormControl("", [Validators.required, cpfOuCnpjValidator]),
        selectPlano: new FormControl(null, Validators.required),
    })




}
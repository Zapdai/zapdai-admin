import { FormControl, FormGroup, Validators } from "@angular/forms";
import { cpfOuCnpjValidator, validarCep, validarEmail } from "../../../validators";
import { Injectable } from "@angular/core";
import { Usuario } from "../../shared/core/types/usuario";
@Injectable({
    providedIn: 'root'
})
export class UpdateDadosUsuario {
    usuarioUpdate!:Usuario
     groupform = new FormGroup({
            nome: new FormControl(this.usuarioUpdate.nome, Validators.required),
            telefone: new FormControl(this.usuarioUpdate.phoneNumer, Validators.required),
            sexo: new FormControl('', Validators.required),
            email: new FormControl('', [Validators.required, Validators.email, validarEmail]),
            cpf: new FormControl('', [Validators.required, Validators.minLength(11), cpfOuCnpjValidator]),
    
            cep: new FormControl('', [Validators.required, validarCep]),
            estado_sigla: new FormControl('', Validators.required),
            cidade: new FormControl('', Validators.required),
            bairro: new FormControl('', Validators.required),
            logradouro: new FormControl('', Validators.required),
            numeroEndereco: new FormControl('', Validators.required),
            complemento: new FormControl('', Validators.required)
     })
   
}
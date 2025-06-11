import { endereco } from "./endereco";

export interface cadastro{
    id?: number,
    nome: string,
    phoneNumer:string,
    sexo:string,
    email?:string ,
    cpf?: string,
    dataNascimento?:string,
    password?:string,
    endereco?: endereco,
}
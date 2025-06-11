import { endereco } from "../types/endereco";

export interface registroEmpresa {
  nomeCompania: string,
  razaoSocial?: string,
  numeroDeTelefone: string,
  endereco: endereco,
  email: string,
  clienteId: number,
  cpf?: string
}
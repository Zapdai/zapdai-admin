export interface registroEmpresa {
  nomeCompania: string,
  razaoSocial?: string,
  numeroDeTelefone: string,
  endereco: endereco,
  email: string,
  clienteId: number,
  cpf?: string
}

export interface endereco {
    numeroEndereco: string,
    latLong?: string,
    rua: string,
    logradouro?: string,
    estado_sigla: string,
    cep: string,
    bairro: string,
    cidade: string
}
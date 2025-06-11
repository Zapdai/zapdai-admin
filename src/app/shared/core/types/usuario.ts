type Role = {
      name: string;

}
export type Usuario = {
  clientId: number;
  nome: any;
  phoneNumer: string;
  cpf: string;
  dataNascimento: string; // ou `Date` se for convertido
  sexo: 'm' | 'f'; // baseado no exemplo
  email: string;
  avatar: string | null;
  role: Role[];
  endereco?:endereco
};

type endereco = {
		numeroEndereco:string
		latLong:string ,
		logradouro:string,
		estado_sigla: string,
		cep: string,
		bairro: string,
		cidade:string
	}

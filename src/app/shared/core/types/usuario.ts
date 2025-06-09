type Role = {
      name: string;

}
export type Usuario = {
  clientId: number;
  nome: string;
  phoneNumer: string;
  cpf: string;
  dataNascimento: string; // ou `Date` se for convertido
  sexo: 'm' | 'f'; // baseado no exemplo
  email: string;
  avatar: string | null;
  role: Role[];
};
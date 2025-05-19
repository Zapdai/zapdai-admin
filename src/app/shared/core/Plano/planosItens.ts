export type itensPlanos = {
  planos: itens[]

}
export type itens = {
  planoId?: string,
  title: string,
  price: number,
  description: string,
  promocao: string | null,
  subDescricaoPermition: string
}
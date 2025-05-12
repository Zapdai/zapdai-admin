export type itensPlanos = {
    planos:itens[]
    
}
export type itens = {
  title: string,
    price: number,
    description: string,
    promocao: string | null,
    subDescricaoPermition: string
}
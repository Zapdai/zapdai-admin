
export type listItensPedido = {
    itensPedido: itensPedido[]
}

export type itensPedido = {
    idProduto: number,
    imgProduct: string,
    productName: string,
    price: number,
    peso: number,
    categoriaProduct: number,
    description: string,
    amountQTD: number,
}

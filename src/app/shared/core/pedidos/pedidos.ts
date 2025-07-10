export type PedidoType = {
  IdUsuario: number;
  itens: {
    quantidade: number;
    id: number;
  }[];
  pagamento: {
    formaDePagament: string;
  };
};

// Tipo atual de lista de itens (plano antigo)
export type listItensPedido = {
  itensPedido: itensPedido[];
};

export type itensPedido = {
  idProduto: number;
  imgProduct: string;
  productName: string;
  price: number;
  peso: number;
  categoriaProduct: number;
  description: string;
  amountQTD: number;
  empresaDTO: {
    id: string;
    nomeCompania: string;
  };
};

// NOVO tipo para carrinho agrupado por empresa:
export type carrinhoPorEmpresa = {
  [empresaId: string]: {
    nomeCompania: string;
    itensPedido: itensPedido[];
  };
};

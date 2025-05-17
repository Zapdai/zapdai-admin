export interface Pagamento {
   token?: string,
   issuerId?: string,
    paymentMethodId: string,
    transactionAmount: number,
    description: string,
    payer: payer
}

interface payer {
   email: string,
   first_name: string,
   last_name: string,
   identification: identification,
   itens?: itens
}

interface identification {
   number: string,
   type: string
}

interface itens {
   id: number,
   title: string,
   description: string,
   quantity: number,
   price: number
}
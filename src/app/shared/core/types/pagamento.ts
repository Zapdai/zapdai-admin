export interface Pagamento {
   token?: string,
   issuerId?: string,
   paymentMethodId: string,
   transactionAmount: number,
   description: string,
   payer: payer,
   itens?: [itens]
}

interface payer {
   email: string,
   first_name: string,
   last_name: string,
   identification: identification
}

interface identification {
   number: string,
   type: string
}

interface itens {
   id: string,
   title: string,
   description: string,
   quantity: number,
   price: number
}
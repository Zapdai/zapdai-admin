import { endereco } from "./endereco"

export interface Pagamento {
   token?: string,
   issuerId?: string,
   paymentMethodId: string,
   transactionAmount: number,
   description: string,
   infoCard?: infoCard
   payer: payer,
   itens?: [itens]
}

interface infoCard {
   cardNumber: number,
   mes: number,
   ano: number,
   cvv: number,
   installments: number,
}

interface payer {
   ipClient?: string,
   email: string,
   nomeCompleto?: string,
   first_name?: string,
   last_name?: string,
   identification: identification,
   endereco?: endereco
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

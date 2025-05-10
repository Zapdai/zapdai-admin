export interface PagamentoPix {
    paymentMethodId: string,
    transactionAmount: number,
    description: string,
    payer: payer
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

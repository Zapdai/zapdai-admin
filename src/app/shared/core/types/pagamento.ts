export interface PagamentoPix {
    "paymentMethodId": string,
    "transactionAmount": number,
    "description": string,
    "payer":{
       "email": string,
       "first_name": string,
       "last_name": string,
       "identification":{
          "number": string,
          "type": string
       }
    }
}
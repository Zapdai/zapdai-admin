import { itens } from "./pagamento";

export interface paymentAsaas {
    paymentMethodId: string,
    name: string,
    cpfCnpj: number,
    email: string,
    phone: number,
    postalCode: number,
    addressNumber: number,
    addressComplement: string,
    creditCardNumber?: number,
    creditCardCcv?: number,
    creditCardExpiryMonth?: number,
    creditCardExpiryYear?: number,
    value: number,
    itens: [itens],
}
export interface cep {
    cep: number,
    state: string,
    city: string,
    neighborhood: string,
    street: string,
    service: string,
    location: {
        type: string,
        coordinates: { }
    }
}


// {
//     "cep": "89010025",
//     "state": "SC",
//     "city": "Blumenau",
//     "neighborhood": "Centro",
//     "street": "Rua Doutor Luiz de Freitas Melro",
//     "service": "viacep",
//     "location": {
//         "type": "Point",
//         "coordinates": { }
//     }
// }
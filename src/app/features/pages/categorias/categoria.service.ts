import { Injectable } from "@angular/core";
import { ApiCategorias } from "../../../services/apiCategorias/apiCategorias.service";
import { firstValueFrom } from "rxjs";

@Injectable({
    providedIn:"root"
})
export class CategoriaServiceNome{
    constructor(private apiCategosrias:ApiCategorias){

    }
    
  async getNomesCategorias(): Promise<string[]> {
    const response = await firstValueFrom(this.apiCategosrias.findAllCategorias());
    // Garante que response.categorias seja um array
    return Array.isArray(response?.categorias) ? response.categorias : [];
  }
   async getNomesProduto(): Promise<string[]> {
    const response = await firstValueFrom(this.apiCategosrias.findAllProdutos());
    const empresas =  Array.isArray(response) ? response : [];
  
    const idsProdutos = empresas.flatMap(empresa => 
    (empresa.produtos ?? []).map((produto:any) => produto.idProduto)
  );

  const idsUnicos = Array.from(new Set(idsProdutos));

  console.log(idsUnicos)
  return empresas;
   }
}
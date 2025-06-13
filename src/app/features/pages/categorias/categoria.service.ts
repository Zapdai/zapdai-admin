import { Injectable } from "@angular/core";
import { ApiCategorias } from "../../../services/apiCategorias/apiCategorias.service";

@Injectable({
    providedIn:"root"
})
export class CategoriaServiceNome{
    constructor(private apiCategosrias:ApiCategorias){

    }
     async getNomesCategorias(): Promise<any[]> {
    return this.apiCategosrias.findAllCategorias().subscribe((response: any) => response.categorias) as unknown as []
  }
}
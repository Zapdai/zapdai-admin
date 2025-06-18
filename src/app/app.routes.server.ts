import { inject } from '@angular/core';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { LojaZapdaiService } from './features/pages/v1/lojaZapdai.service';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'v1/categoria/:nome',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const dataService = inject(LojaZapdaiService);
      const ids = await dataService.getNomesCategorias(); 
      return ids.map((categoria: any) => ({ nome:categoria.nome })); 
    },
  },
   {
    path: 'v1/produto/detalhes/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const dataService = inject(LojaZapdaiService);
      const produtos = await dataService.getNomesProduto(); 
      return produtos.map((item:any)=>({id:String(item.idProduto)})); 
    },
  },
    {
    path: '**',
    renderMode: RenderMode.Server
  }
];

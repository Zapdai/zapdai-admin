import { inject } from '@angular/core';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { LojaZapdaiService } from './features/pages/v1/lojaZapdai.service';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'categoria/:nome',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const dataService = inject(LojaZapdaiService);
      const ids = await dataService.getNomesCategorias(); 
      return ids.map((categoria: any) => ({ nome:categoria.nome })); 
    },
  },
   {
    path: 'produto/detalhes/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const dataService = inject(LojaZapdaiService);
      const produtos = await dataService.getNomesProduto(); 
      return produtos.map((item:any)=>({id:String(item?.idProduto)})); 
    },
  },
  {
    path: 'empresa/produto/:idEmpresa',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const dataService = inject(LojaZapdaiService);
      const produtos = await dataService.retonrIdEmpres(); 
      return produtos.map((item:any)=>({idEmpresa:String(item?.idEmpresa)})); 
    },
  },
    {
    path: '**',
    renderMode: RenderMode.Server
  }
];

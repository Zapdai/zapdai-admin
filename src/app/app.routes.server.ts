import { inject } from '@angular/core';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { CategoriasComponent } from './features/pages/categorias/categorias.component';
import { CategoriaServiceNome } from './features/pages/categorias/categoria.service';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Client
  },
  {
    path: 'home/categoria/:nome',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const dataService = inject(CategoriaServiceNome);
      const ids = await dataService.getNomesCategorias(); 
      return ids.map((categoria: any) => ({ nome:categoria.nome })); 
    },
  }
];

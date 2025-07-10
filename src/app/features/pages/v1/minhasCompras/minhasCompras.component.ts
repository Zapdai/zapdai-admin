import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { headerComponent } from "../../../../shared/component/header/header.component";
import { MobileNavbarComponent } from "../../../../shared/component/mobile-navbar/mobile-navbar.component";
import { PedidosService } from '../../../../services/pedidosService/pedidos.service';
import { AuthDecodeService } from '../../../../services/AuthUser.service';
import { CarrinhoComponent } from '../carrinho/carrinho.component';

@Component({
   selector: 'app-minhasCompras',
   standalone: true,
   imports: [CommonModule, headerComponent, MobileNavbarComponent, CarrinhoComponent,],
   templateUrl: './minhasCompras.component.html',
   styleUrl: './minhasCompras.component.scss'
})
export class MinhasComprasComponent implements OnInit {
   pedidos: any[] = [];
   carregando = true;
   ativaCar?: boolean;

   constructor(
      private pedidosService: PedidosService,
      public authDecodeUser: AuthDecodeService,
   ) { }

   ngOnInit() {
      this.buscarPedidosDoUsuario();
   }

   ativaCarrinho() {
      this.ativaCar = !this.ativaCar;
   }

   async buscarPedidosDoUsuario() {
      try {
         const usuarioId = this.authDecodeUser.getusuarioId();

         if (!usuarioId) {
            console.error('Usuário não autenticado');
            return;
         }

         const resposta = await this.pedidosService.listaPedidosUser(usuarioId).toPromise();
         this.pedidos = Object.values(resposta)
            .flat()
            .sort((a: any, b: any) => new Date(b.dataDeCriacao).getTime() - new Date(a.dataDeCriacao).getTime());

      } catch (erro) {
         console.error('Erro ao buscar pedidos', erro);
      } finally {
         this.carregando = false;
      }
   }


}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { OpcoesCategoriaComponent } from '../../../../shared/component/opcoes-categoria/opcoes-categoria.component';
import { headerComponent } from '../../home/header/header.component';
import { CarrosselComponent } from '../../../../shared/component/carrossel/carrossel.component';
import { MobileNavbarComponent } from '../../home/mobile-navbar/mobile-navbar.component';
import { MaisPostadosComponent } from '../../../../shared/component/mais-postados/mais-postados.component';
import { MatTabsModule } from '@angular/material/tabs';
import { footerComponent } from '../../home/foother/footer.component';
import { ApiV1Loja } from '../../../../services/apiCategorias/apiV1Loja.service';
import { CarrinhoComponent } from '../../home/carrinho/carrinho.component';

@Component({
  selector: 'app-homeZapdai',
  imports: [headerComponent, OpcoesCategoriaComponent,
    CarrosselComponent, MaisPostadosComponent, footerComponent,
    MobileNavbarComponent, MatTabsModule,CarrinhoComponent],
  templateUrl: './homeZapdai.component.html',
  styleUrl: './homeZapdai.component.scss'
})
export class HomeZapdaiComponent implements OnInit {
  constructor(private apiCategosrias: ApiV1Loja, public router: Router) { }
  categorias: any;
  produtos: any
  ativaCar = false;
  ngOnInit(): void {
    this.getAllCategorias()
    this.getAllProdutos()
  }
  async getAllCategorias() {
    try {
      const response = await await firstValueFrom(this.apiCategosrias.findAllCategorias());
      this.categorias = response.categorias;
    } catch (erro) {
      console.log("Erro ao carregar dados!");
    }
  }
  async getAllProdutos() {
    try {
      const response = await firstValueFrom(this.apiCategosrias.findAllProdutos());
      this.produtos = response;
    } catch (error) {
        console.log("Erro ao carregar dados!");

    }
  }



  navigate(name: any) {
    this.router.navigateByUrl(`/v1/categoria/${name}`)
  }
  navigateDetalhesProdutos(name: any) {
    this.router.navigateByUrl(`/detalhes/produto/${name}`)
  }

  async getNomesCategorias(): Promise<any[]> {
    return this.categorias;
  }
  ativaCarrinho(){
   this.ativaCar = !this.ativaCar;
  }
}

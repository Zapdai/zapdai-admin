import { Component, OnInit } from '@angular/core';
import { headerComponent } from '../home/header/header.component';
import { DestaqueComponent } from '../destaque/destaque.component';
import { CarrosselComponent } from '../../../shared/component/carrossel/carrossel.component';
import { OpcoesCategoriaComponent } from '../../../shared/component/opcoes-categoria/opcoes-categoria.component';
import { ModalComponent } from '../../../shared/component/modal/modal.component';
import { MaisPostadosComponent } from '../../../shared/component/mais-postados/mais-postados.component';
import { PageContainerComponent } from "../../../shared/component/page-container/page-container.component";
import { footerComponent } from "../home/foother/footer.component";
import { MobileNavbarComponent } from "../home/mobile-navbar/mobile-navbar.component";
import { MatTabsModule } from '@angular/material/tabs';
import { apiBuscaUserService } from '../../../services/buscaUser/buscaUser.service';
import { ApiCategorias } from '../../../services/apiCategorias/apiCategorias.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-categorias',
  imports: [headerComponent, OpcoesCategoriaComponent,
    CarrosselComponent, MaisPostadosComponent, footerComponent,
    MobileNavbarComponent, MatTabsModule],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss'
})
export class CategoriasComponent implements OnInit {
  constructor(private apiCategosrias: ApiCategorias, public router: Router) { }
  categorias: any;
  produtos: any
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
    this.router.navigateByUrl(`/home/categoria/${name}`)
  }
  navigateDetalhesProdutos(name: any) {
    this.router.navigateByUrl(`/detalhes/produto/${name}`)
  }

  async getNomesCategorias(): Promise<any[]> {
    return this.categorias;
  }
}

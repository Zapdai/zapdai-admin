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

@Component({
  selector: 'app-categorias',
  imports: [headerComponent, OpcoesCategoriaComponent, 
    CarrosselComponent, MaisPostadosComponent, footerComponent, 
    MobileNavbarComponent, MatTabsModule],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss'
})
export class CategoriasComponent implements OnInit{
  constructor(private apiCategosrias:ApiCategorias,public router:Router){}
  categorias:any;
  ngOnInit(): void {
   this.getAllCategorias()
  }
  getAllCategorias(){
   this.apiCategosrias.findAllCategorias().subscribe((item:any)=>{
     if(item!==null){
         this.categorias = item.categorias;
     }
   })
  }


  navigate(name:any){
    this.router.navigateByUrl(`/home/categoria/${name}`)
  }


}

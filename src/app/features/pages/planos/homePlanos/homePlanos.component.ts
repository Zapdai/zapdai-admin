import { Component, OnInit } from '@angular/core';
import { PageContainerComponent } from "../../../../shared/component/page-container/page-container.component";
import { footerComponent } from "../../home/foother/footer.component";
import { BannerComponent } from "../../../../shared/component/banner/banner.component";
import {MatListModule} from '@angular/material/list';
import { AsideComponent } from '../../../../shared/component/aside-modal/aside-modal.component';
import { Router, RouterOutlet } from '@angular/router';
import { loadingService } from '../../../../services/loading/loading.service';
import { formModalComponent } from "../../../../shared/component/formModel/formModal.component";
import { PlanosItensComponent } from '../../../../shared/component/plano_itens/planositem.component';
import { PlanoService } from '../../../../services/planosServices/planos.service';
import { itensPlanos } from '../../../../shared/core/Plano/planosItens';

@Component({
  selector: 'app-homePlanos',
  imports: [PageContainerComponent,
     footerComponent, BannerComponent,
      MatListModule, AsideComponent, 
      formModalComponent,
      PlanosItensComponent
    ],
  templateUrl: './homePlanos.component.html',
  styleUrl: './homePlanos.component.scss'
})
export class HomePlanosComponent implements OnInit { 
  data?:itensPlanos; 
  constructor (private router: Router,public apiService:PlanoService){}
  ngOnInit(): void {
    this.apiService.planosConsumoApi().subscribe(itens=>{
      if(itens){
        this.data = itens;
      }
    })
    
  }
  img = "/banners/banner-planos.png"
  ativ = false;

  ativaModal(){
    this.router.navigateByUrl("/planos/payment")
  }
  
  pageCheckout(){
    this.router.navigate(['/planos/checkout'], { skipLocationChange: false })
  }

  pageCheckout02(){
    this.router.navigate(['/planos/checkout02'], { skipLocationChange: false })
  }
}

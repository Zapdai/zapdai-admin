import { Component } from '@angular/core';
import { PageContainerComponent } from "../../../../shared/component/page-container/page-container.component";
import { footerComponent } from "../../home/foother/footer.component";
import { BannerComponent } from "../../../../shared/component/banner/banner.component";
import {MatListModule} from '@angular/material/list';
import { AsideComponent } from '../../../../shared/component/aside-modal/aside-modal.component';
import { Router, RouterOutlet } from '@angular/router';
import { loadingService } from '../../../../services/loading/loading.service';
import { formModalComponent } from "../../../../shared/component/formModel/formModal.component";

@Component({
  selector: 'app-homePlanos',
  imports: [PageContainerComponent, footerComponent, BannerComponent, MatListModule, AsideComponent, formModalComponent],
  templateUrl: './homePlanos.component.html',
  styleUrl: './homePlanos.component.scss'
})
export class HomePlanosComponent {  
  constructor (private router: Router, private activeRouter:loadingService){}
  img = "/banners/banner-planos.png"
  ativ = false;

  ativaModal(){
    this.ativ = !this.ativ;
  }
  
  pageCheckout(){
    this.router.navigate(['/planos/checkout'], { skipLocationChange: false })
  }
}

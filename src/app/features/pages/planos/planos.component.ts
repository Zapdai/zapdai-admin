import { Component } from '@angular/core';
import { headerComponent } from '../home/header/header.component';
import { PageContainerComponent } from "../../../shared/component/page-container/page-container.component";
import { footerComponent } from "../home/foother/footer.component";
import { BannerComponent } from "../../../shared/component/banner/banner.component";
import {MatListModule} from '@angular/material/list';
import { AsideComponent } from '../../../shared/component/aside-modal/aside-modal.component';
import { CheckoutComponent } from '../../../shared/component/checkout/checout.component';

@Component({
  selector: 'app-planos',
  imports: [headerComponent, PageContainerComponent, footerComponent, BannerComponent, MatListModule,AsideComponent,CheckoutComponent],
  templateUrl: './planos.component.html',
  styleUrl: './planos.component.scss'
})
export class PlanosComponent {
  img = "/banners/banner-planos.png"
  ativ = false;

  ativaModal(){
    this.ativ = !this.ativ;
  }

}

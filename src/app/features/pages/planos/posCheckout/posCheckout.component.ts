import { Component } from '@angular/core';
import { PageContainerComponent } from '../../../../shared/component/page-container/page-container.component';
import { footerComponent } from '../../home/foother/footer.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-posCheckout',
  standalone: true,
  imports: [PageContainerComponent, footerComponent],
  templateUrl: './posCheckout.component.html',
  styleUrls: ['./posCheckout.component.scss']
})
export class PosCheckoutComponent {
  
  constructor (private router: Router){}
  pageCadastroEmpresa(){
    this.router.navigateByUrl('/planos/create-business', { skipLocationChange: false })
  }
}

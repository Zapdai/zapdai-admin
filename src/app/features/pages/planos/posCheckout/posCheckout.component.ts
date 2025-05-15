import { Component } from '@angular/core';
import { PageContainerComponent } from '../../../../shared/component/page-container/page-container.component';
import { footerComponent } from '../../home/foother/footer.component';

@Component({
  selector: 'app-posCheckout',
  standalone: true,
  imports: [PageContainerComponent, footerComponent],
  templateUrl: './posCheckout.component.html',
  styleUrls: ['./posCheckout.component.scss']
})
export class PosCheckoutComponent {
  plano = 'Zapdai Pleno';
  valor = 'R$ 147,00';
  dataAtivacao = new Date().toLocaleDateString();
  linkPainel = 'https://zapdai.com/admin';
  linkSuporte = 'https://wa.me/SEUNUMEROAQUI';
}

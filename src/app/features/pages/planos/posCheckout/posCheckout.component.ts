import { Component } from '@angular/core';
import { PageContainerComponent } from '../../../../shared/component/page-container/page-container.component';
import { Router } from '@angular/router';
import { footerComponent } from '../../../../shared/component/foother/footer.component';

@Component({
  selector: 'app-posCheckout',
  standalone: true,
  imports: [PageContainerComponent, footerComponent],
  templateUrl: './posCheckout.component.html',
  styleUrls: ['./posCheckout.component.scss']
})
export class PosCheckoutComponent {

  constructor(private router: Router) { }
  pageAdmin() {
    this.router.navigate(['/admin']);
  }
}

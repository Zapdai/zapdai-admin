import { Component } from '@angular/core';
import { PageContainerComponent } from '../../../../shared/component/page-container/page-container.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loadingPayment',
  standalone: true,
  imports: [PageContainerComponent],
  templateUrl: './loadingPayment.component.html',
  styleUrls: ['./loadingPayment.component.scss']
})
export class LoadingPaymentComponent {
  
  constructor (private router: Router){}
}

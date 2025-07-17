import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loadingPayment',
  standalone: true,
  imports: [],
  templateUrl: './loadingPayment.component.html',
  styleUrls: ['./loadingPayment.component.scss']
})
export class LoadingPaymentComponent {
  
  constructor (private router: Router){}
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-posCheckout',
  standalone: true,
  imports: [],
  templateUrl: './posCheckout.component.html',
  styleUrls: ['./posCheckout.component.scss']
})
export class PosCheckoutComponent {

  constructor(private router: Router) { }
  pageAdmin() {
    this.router.navigate(['/admin']);
  }
}

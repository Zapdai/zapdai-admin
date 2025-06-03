import { Component } from '@angular/core';
import { PageContainerComponent } from '../../../shared/component/page-container/page-container.component';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [PageContainerComponent, RouterOutlet],
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent {
  
  constructor (private router: Router){}
}

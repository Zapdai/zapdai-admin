import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { PageContainerComponent } from '../../../../shared/component/page-container/page-container.component';
import { headerComponent } from "../../home/header/header.component";
import { MobileNavbarComponent } from "../../home/mobile-navbar/mobile-navbar.component";

@Component({
  selector: 'app-home-my-account',
  standalone: true,
  imports: [PageContainerComponent, headerComponent, MobileNavbarComponent],
  templateUrl: './home-my-account.component.html',
  styleUrls: ['./home-my-account.component.scss']
})
export class HomeMyAccountComponent {
  
  constructor (private router: Router){}
}

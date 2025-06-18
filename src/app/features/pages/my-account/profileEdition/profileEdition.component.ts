import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MobileNavbarComponent } from '../../home/mobile-navbar/mobile-navbar.component';
import { FormProfileEditionComponent } from './form-ProfileEdition/form-ProfileEdition.component';

@Component({
  selector: 'app-profileEdition',
  standalone: true,
  imports: [ FormProfileEditionComponent, MobileNavbarComponent],
  templateUrl: './profileEdition.component.html',
  styleUrls: ['./profileEdition.component.scss']
})
export class ProfileEditionComponent {
  
  constructor (private router: Router){}
  pageCadastroEmpresa(){
    this.router.navigateByUrl('/planos/create-business', { skipLocationChange: false })
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormProfileEditionComponent } from './form-ProfileEdition/form-ProfileEdition.component';
import { MobileNavbarComponent } from '../../../../shared/component/mobile-navbar/mobile-navbar.component';

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

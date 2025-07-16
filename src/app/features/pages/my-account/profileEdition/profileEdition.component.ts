import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormProfileEditionComponent } from './form-ProfileEdition/form-ProfileEdition.component';

@Component({
  selector: 'app-profileEdition',
  standalone: true,
  imports: [ FormProfileEditionComponent],
  templateUrl: "./profileEdition.component.html",
  styleUrl: "./profileEdition.component.scss"
})
export class ProfileEditionComponent {
  
  constructor (private router: Router){}
  pageCadastroEmpresa(){
    this.router.navigateByUrl('/planos/create-business', { skipLocationChange: false })
  }
}

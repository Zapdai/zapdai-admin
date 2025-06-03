import { Component } from '@angular/core';
import { PageContainerComponent } from '../../../shared/component/page-container/page-container.component';
import { Router } from '@angular/router';
import { FormProfileEditionComponent } from "./form-ProfileEdition/form-ProfileEdition.component";

@Component({
  selector: 'app-profileEdition',
  standalone: true,
  imports: [PageContainerComponent, FormProfileEditionComponent],
  templateUrl: './profileEdition.component.html',
  styleUrls: ['./profileEdition.component.scss']
})
export class ProfileEditionComponent {
  
  constructor (private router: Router){}
  pageCadastroEmpresa(){
    this.router.navigateByUrl('/planos/create-business', { skipLocationChange: false })
  }
}

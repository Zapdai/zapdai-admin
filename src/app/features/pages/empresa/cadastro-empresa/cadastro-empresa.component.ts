import { Component } from '@angular/core';
import { PageContainerComponent } from '../../../../shared/component/page-container/page-container.component';
import { Router } from '@angular/router';
import { FormCadastroEmpresaComponent } from "../../../../shared/component/form-cadastro-empresa/form-cadastro-empresa.component";

@Component({
  selector: 'app-cadastro-empresa',
  standalone: true,
  imports: [PageContainerComponent, FormCadastroEmpresaComponent],
  templateUrl: './cadastro-empresa.component.html',
  styleUrls: ['./cadastro-empresa.component.scss']
})
export class CadastroEmpresaComponent {
  
  constructor (private router: Router){}
  pageCadastroEmpresa(){
    this.router.navigateByUrl('/planos/create-business', { skipLocationChange: false })
  }
}

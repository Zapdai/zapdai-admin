import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProdutosApiService } from '../../../../services/produtoService/produtosApi.service';
import { firstValueFrom } from 'rxjs';
import { UtiusComponent } from '../../../../shared/component/utius/utius.component';
import { MaisPostadosComponent } from "../../../../shared/component/mais-postados/mais-postados.component";
type imagens = {
  url:string
}
type produtos = {
  amountQTD: number
  categoria:
  { id: number, nome: string }
  description: string
  idProduto: number
  imgUrl: string
  peso: number
  price: never
  productName: string,
  imagens:imagens[]
  

}

type empresa = {
  avatar: string,
  email: string
  idEmpresa: string,
  nomeCompania: string,
  numeroDeTelefone: string,
  produtos: produtos[]
}
@Component({
  selector: 'produto-cadastro-empresa',
  standalone: true,
  imports: [UtiusComponent, MaisPostadosComponent],
  templateUrl: './produto-empresa.component.html',
  styleUrls: ['./produto-empresa.component.scss']
})
export class ProdutoEmpresaComponent implements OnInit {
  imagem: any;
  idEmpresaRota: any
  empresa?: empresa[];

  constructor(private router: Router, private activeRouter: ActivatedRoute, private produtosApi: ProdutosApiService) { }
  ngOnInit(): void {
    this.itensEmpresa();

  }
  async itensEmpresa() {
    try {
      const idEmpresaRota = this.activeRouter.snapshot.paramMap.get('idEmpresa') as any;

      const response = await firstValueFrom(this.produtosApi.ProdutoEmpresa(idEmpresaRota));
      const data = Array.isArray(response.content) ? response.content : [];
      this.empresa = data;


    } catch (error) {

    }

  }
}

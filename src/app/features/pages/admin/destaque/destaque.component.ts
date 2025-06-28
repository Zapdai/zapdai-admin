import { Component } from "@angular/core";
import { MaisPostadosComponent } from "../../../../shared/component/mais-postados/mais-postados.component";
import { ActivatedRoute, Router } from "@angular/router";
import { ProdutosApiService } from "../../../../services/produtoService/produtosApi.service";
import { firstValueFrom } from "rxjs";
import { UtiusComponent } from "../../../../shared/component/utius/utius.component";
import { AuthDecodeService } from "../../../../services/AuthUser.service";
import { UtiusAdminComponent } from "../produtos/utiusAdmin/utiusAdmin.component";
import { UpdateProductComponent } from "../produtos/update-product/update-product.component";

type produtos = {
    amountQTD: number
    categoria:
    { id: number, nome: string }
    description: string
    idProduto: number
    imgUrl: string
    peso: number
    price: never
    productName: string

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
    selector: "app-destaque",
    standalone: true,
    imports: [MaisPostadosComponent, UtiusAdminComponent, UpdateProductComponent],
    templateUrl: "./destaque.component.html",
    styleUrl: "./destaque.component.scss"
})
export class DestaqueComponent {
    imagem: any;
    id: any
    empresa?: empresa[];
    idProdutoEditando: number | null = null;

    constructor(private router: Router, private activeRouter: ActivatedRoute, private produtosApi: ProdutosApiService,

        public authDecodeUser: AuthDecodeService,
    ) { }
    ngOnInit(): void {
        this.itensEmpresa();

    }
    async itensEmpresa() {
        try {
            const response = await firstValueFrom(this.produtosApi.ProdutoEmpresa(this.authDecodeUser.getEmpresaId()));
            const data = Array.isArray(response.content) ? response.content : [];
            this.empresa = data;


        } catch (error) {

        }

    }


    rodaFunc(event: any) {

        this.router.navigateByUrl(`produto/detalhes/${event}`)
    }

    abrirEdicao(id: number) {
        this.idProdutoEditando = id;
    }

    fecharEdicao() {
        this.idProdutoEditando = null;
    }
}

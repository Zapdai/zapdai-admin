import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { UtiusComponent } from "../../../../shared/component/utius/utius.component";
import { ApiV1Loja } from "../../../../services/apiCategorias/apiV1Loja.service";
import { headerComponent } from "../../../../shared/component/header/header.component";
@Component({
    selector: "app-BuscaProdutos",
    imports: [UtiusComponent,headerComponent],
    standalone: true,
    templateUrl: "./buscaProdutos.component.html",
    styleUrl: "./buscaProdutos.component.scss"
})
export class buscaProdutos implements OnInit {
    constructor(public api: ApiV1Loja, private router: ActivatedRoute) { }
    name: any;
    produtos: any;
    ngOnInit(): void {
        this.rodaApi()
    }

    async rodaApi() {
        try {
            this.name = this.router.snapshot.paramMap.get("nome") as any
            const respose = await firstValueFrom(this.api.findOneProdutoCategoria(this.name));
            this.produtos = respose.content;
        } catch (error) {

        }


    }


}
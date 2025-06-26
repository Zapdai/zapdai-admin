import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from '@angular/material/icon';
import { firstValueFrom } from "rxjs";
import { ApiV1Loja } from "../../../../../services/apiCategorias/apiV1Loja.service";
import { UtiusComponent } from "../../../../../shared/component/utius/utius.component";
import { Router } from "@angular/router";
import { CreateProductComponent } from "../create-product/create-product.component";
import { AuthDecodeService } from "../../../../../services/AuthUser.service";
import { CategoriasComponent } from "../categorias/categorias.component";

@Component({
    selector: "app-produtos",
    imports: [MatIconModule, ReactiveFormsModule, UtiusComponent, CreateProductComponent, CategoriasComponent],
    standalone: true,
    templateUrl: "./produtosAdmin.component.html",
    styleUrl: "./produtosAdmin.component.scss"
})
export class ProdutosAdminComponent implements OnInit {
    todosProdutos: any;
    @Input() produto: any;
    groupSearh = new FormGroup({
        name: new FormControl("")
    })
    ativaCreatProduct = false;
    openCategory = false;
    @Output() emitCreatProduct = new EventEmitter();


    constructor(
        private ApiV1Loja: ApiV1Loja,
        public router: Router,
        public authDecodeUser: AuthDecodeService,
    ) { }


    ngOnInit(): void {
        this.getAllProdutosEmpresa();
    }


    async getAllProdutosEmpresa() {
        try {
            const response = await firstValueFrom(this.ApiV1Loja.findAllProdutosEmpresa(this.authDecodeUser.getEmpresaId()));
            this.todosProdutos = response.content[0]?.produtos || [];
        } catch (error) {
            console.error("Erro ao buscar produtos da empresa:", error);
            this.todosProdutos = []; // Evita produtos indefinidos em caso de erro
        }
    }

    pegarvalor() {
        const name = this.groupSearh.get("name")?.value;
        alert("valor digitado " + name)
    }

    rodaFunc(event: any) {

        this.router.navigateByUrl(`produto/detalhes/${event}`)
    }

    emitProduct() {
        this.emitCreatProduct.emit();
    }

    ativaProduct() {
        this.ativaCreatProduct = !this.ativaCreatProduct;
    }

    ativaCategory() {
        this.openCategory = !this.openCategory;
    }
}
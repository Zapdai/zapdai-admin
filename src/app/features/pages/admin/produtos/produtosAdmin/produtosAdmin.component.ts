import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from '@angular/material/icon';
import { firstValueFrom, map, Observable, startWith } from "rxjs";
import { ApiV1Loja } from "../../../../../services/apiCategorias/apiV1Loja.service";
import { UtiusComponent } from "../../../../../shared/component/utius/utius.component";
import { Router } from "@angular/router";
import { CreateProductComponent } from "../create-product/create-product.component";
import { AuthDecodeService } from "../../../../../services/AuthUser.service";
import { CategoriasComponent } from "../categorias/categorias.component";
import { CommonModule } from '@angular/common';
import { UtiusAdminComponent } from "../utiusAdmin/utiusAdmin.component";
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { UpdateProductComponent } from "../update-product/update-product.component";


@Component({
    selector: "app-produtos",
    imports: [
        CommonModule,
        MatIconModule,
        MatMenuModule,
        ReactiveFormsModule,
        CreateProductComponent,
        CategoriasComponent,
        UtiusAdminComponent,
        MatButtonModule,
        UpdateProductComponent
    ],
    standalone: true,
    templateUrl: "./produtosAdmin.component.html",
    styleUrl: "./produtosAdmin.component.scss"
})
export class ProdutosAdminComponent implements OnInit {
    todosProdutos: any[] = [];
    filteredProdutos!: Observable<any> | undefined;
    @Input() produto: any;
    groupSearh = new FormGroup({
        searchProduct: new FormControl("")
    })
    ativaCreatProduct = false;
    ativaUpdateProduct = false;
    openCategory = false;
    @Output() emitUpdateProduct = new EventEmitter();
    idProdutoEditando: number | null = null;

    constructor(
        private ApiV1Loja: ApiV1Loja,
        public router: Router,
        public authDecodeUser: AuthDecodeService,
    ) { }


    async ngOnInit(): Promise<void> {
        await this.getAllProdutosEmpresa();

        this.filteredProdutos = this.groupSearh.get("searchProduct")!.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || ''))
        );
    }



    async getAllProdutosEmpresa() {
        try {
            const response = await firstValueFrom(this.ApiV1Loja.findAllProdutosEmpresa(this.authDecodeUser.getEmpresaId()));
            this.todosProdutos = response.content[0]?.produtos || [];

        } catch (error) {
            console.error("Erro ao buscar produtos da empresa:", error);
            this.todosProdutos = [];
        }
    }


    private _filter(value: string): any[] {
        const filterValue = this._normalizeValue(value);

        return this.todosProdutos.filter(produto =>
            this._normalizeValue(produto.productName).includes(filterValue) ||
            this._normalizeValue(String(produto.idProduto)).includes(filterValue)
        );
    }


    private _normalizeValue(value: string): string {
        return value.toLowerCase().replace(/\s/g, '');
    }

    get hasSearchValue(): boolean {
        return !!this.groupSearh.get('searchProduct')?.value?.trim();
    }


    pegarvalor() {
        const name = this.groupSearh.get("searchProduct")?.value;
        alert("valor digitado " + name)
    }

    rodaFunc(event: any) {

        this.router.navigateByUrl(`produto/detalhes/${event}`)
    }

    emitProduct() {
        this.emitUpdateProduct.emit();
    }

    ativaProduct() {
        this.ativaCreatProduct = !this.ativaCreatProduct;
    }

    abrirEdicao(id: number) {
        this.idProdutoEditando = id;
    }

    fecharEdicao() {
        this.idProdutoEditando = null;
    }

    ativaCategory() {
        this.openCategory = !this.openCategory;
    }
}
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


@Component({
    selector: "app-produtos",
    imports: [CommonModule, MatIconModule, ReactiveFormsModule, UtiusComponent, CreateProductComponent, CategoriasComponent],
    standalone: true,
    templateUrl: "./produtosAdmin.component.html",
    styleUrl: "./produtosAdmin.component.scss"
})
export class ProdutosAdminComponent implements OnInit {
    todosProdutos: any[] = [];
    filteredProdutos!: Observable<any> | undefined;
    @Input() produto: any;
    groupSearh = new FormGroup({
        productName: new FormControl("")
    })
    ativaCreatProduct = false;
    openCategory = false;
    @Output() emitCreatProduct = new EventEmitter();


    constructor(
        private ApiV1Loja: ApiV1Loja,
        public router: Router,
        public authDecodeUser: AuthDecodeService,
    ) { }


    async ngOnInit(): Promise<void> {
        this.getAllProdutosEmpresa();


        this.filteredProdutos = this.groupSearh.get("productName")!.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || ''))
        );
    }


    async getAllProdutosEmpresa() {
        try {
            const response = await firstValueFrom(this.ApiV1Loja.findAllProdutosEmpresa(this.authDecodeUser.getEmpresaId()));
            this.todosProdutos = response.content[0]?.produtos || [];

            // Limpa o campo de busca
            this.groupSearh.get('productName')?.setValue('');
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
        return !!this.groupSearh.get('productName')?.value?.trim();
    }


    pegarvalor() {
        const name = this.groupSearh.get("productName")?.value;
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
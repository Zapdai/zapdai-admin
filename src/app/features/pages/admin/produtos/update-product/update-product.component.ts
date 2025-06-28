import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, OnChanges, SimpleChanges } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { firstValueFrom, map, of, startWith } from "rxjs";
import { ApiV1Loja } from "../../../../../services/apiCategorias/apiV1Loja.service";
import { ProdutosApiService } from "../../../../../services/produtoService/produtosApi.service";
import { SnackService } from "../../../../../services/snackBar/snack.service";
import { Router } from "@angular/router";
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule, Validators } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { pesoValidator, precoValidator } from "../../../../../../validators";
import { AuthDecodeService } from "../../../../../services/AuthUser.service";
import { ImageDropCarrosselComponent } from "../imageDropCarrossel/image-drop-carrossel.component";
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ImageDropCarrossel02Component } from "../imageDropCarrossel02/image-drop-carrossel.component";

@Component({
   selector: "app-update-product",
   standalone: true,
   imports: [
      MatIconModule,
      MatButtonModule,
      AsyncPipe,
      ReactiveFormsModule,
      CommonModule,
      FormsModule,
      MatAutocompleteModule,
      ImageDropCarrossel02Component
   ],
   schemas: [CUSTOM_ELEMENTS_SCHEMA],

   templateUrl: "./update-product.component.html",
   styleUrls: ["./update-product.component.scss"],

})
export class UpdateProductComponent implements OnInit, AfterViewInit {
   todosProdutos: any;
   produto: any;
   categorias: any[] = [];
   selectedValue: string = '';
   filteredStreets!: Observable<any> | undefined;
   @Input() idProduto!: number;
   files: File[] = [];
   preco: number = 0;
   control = new FormControl('');
   images: { url: string; file?: File }[] = [];

   groupform: FormGroup = new FormGroup({
      productName: new FormControl(''),
      price: new FormControl(''),
      peso: new FormControl(''),
      categoriaId: new FormControl(''),
      description: new FormControl(''),
      amountQTD: new FormControl(''),
   });

   @ViewChild('primeiroInput') primeiroInput!: ElementRef;
   @Output() desbiledCarEmit = new EventEmitter<void>();

   constructor(
      private api: ApiV1Loja,
      private apiCadastroProdutos: ProdutosApiService,
      private snack: SnackService,
      private router: Router,
      public authDecodeUser: AuthDecodeService,
   ) { }

   async loadProduto() {
      try {
         const resposta = await firstValueFrom(this.api.findOneProduto(this.idProduto));
         const produto = resposta;

         if (!produto) {
            this.snack.error('Produto não encontrado');
            return;
         }

         this.CarregaFormGroup(produto);

         // ✅ Agora popula todas as imagens corretamente
         this.images = produto.imagens?.map((img: any) => ({
            url: img.url,
            file: undefined
         })) || [];

         await this.getAllCategorias();

         this.filteredStreets = this.groupform.get("categoriaId")?.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || ''))
         );
      } catch (e) {
         console.error("Erro ao carregar produto:", e);
         this.snack.error("Erro ao carregar produto.");
      }
   }



   ngAfterViewInit() {
      const container = document.querySelector('.container');
      if (container) {
         container.addEventListener('scroll', () => {
            this.trigger.updatePosition(); // força o overlay a reposicionar
         });
      }
   }


   async ngOnInit(): Promise<void> {
      if (this.idProduto) {
         await this.loadProduto();
      } else {
         await this.getAllCategorias();
         this.CarregaFormGroup();
         this.filteredStreets = this.groupform.get("categoriaId")?.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || '')),
         );
      }
   }


   private _filter(value: any): string[] {
      const nome = typeof value === 'string' ? value : value?.nome || '';
      const filterValue = this._normalizeValue(nome);
      return this.categorias.filter(street => this._normalizeValue(street.nome).includes(filterValue));
   }

   private _normalizeValue(value: string): string {
      return value.toLowerCase().replace(/\s/g, '');
   }
   displayCategoriaNome = (categoria: any): string => {
      return categoria && categoria.nome ? categoria.nome : '';
   };



   async getAllProdutosEmpresa() {
      try {
         const response = await firstValueFrom(this.api.findAllProdutosEmpresa(this.authDecodeUser.getEmpresaId()));
         this.todosProdutos = response.content[0]?.produtos || [];
      } catch (error) {
         console.error("Erro ao buscar produtos da empresa:", error);
         this.todosProdutos = []; // Evita produtos indefinidos em caso de erro
      }
   }

   async getAllCategorias() {
      try {
         const response = await await firstValueFrom(this.api.findAllCategorias());
         this.categorias = response?.categorias || [];
      } catch (erro) {
         console.log("Erro ao carregar dados!");
         this.categorias = [];
      }
   }

   desabiledCar() {
      this.desbiledCarEmit.emit();
   }

   filhoClicado(event: Event) {
      event.stopPropagation();
   }

   // Recebe as imagens do componente filho
   select(files: File[]) {
      const MAX_MB = 10;
      const arquivosValidos: File[] = [];
      const erros: string[] = [];

      for (const file of files) {
         const tamanhoMB = file.size / (1024 * 1024);
         if (tamanhoMB > MAX_MB) {
            erros.push(`"${file.name}" (${tamanhoMB.toFixed(2)} MB)`);
         } else {
            arquivosValidos.push(file);
         }
      }

      if (erros.length) {
         this.snack.error(`As seguintes imagens ultrapassam 10MB:\n${erros.join('\n')}`);
      }

      this.files = arquivosValidos;
   }




   async saveProduct() {
      // Marca todos os campos como tocados para exibir erros visuais
      Object.values(this.groupform.controls).forEach(control => control.markAsTouched());

      // Validação do formulário
      if (!this.groupform.valid) {
         this.snack.error("Preencha todos os campos obrigatórios.");
         return;
      }

      // Validação da imagem
      if (this.files.length === 0 && this.images.length === 0) {
         this.snack.error("Adicione pelo menos uma imagem do produto.");
         return;
      }



      const data: any = {

         idEmpresa: this.authDecodeUser.getEmpresaId(),
         productName: this.groupform.get('productName')?.value,
         price: this.groupform.get('price')?.value,
         peso: this.groupform.get('peso')?.value,
         categoria: { nome: this.groupform.get('categoriaId')?.value },
         description: this.groupform.get('description')?.value,
         amountQTD: this.groupform.get('amountQTD')?.value,
      };

      try {
         const response = await firstValueFrom(
            this.apiCadastroProdutos.cadastroDeProduto(data, this.files)
         );
         if (response) {
            this.snack.openSnackBar(response);
            this.reloadRoute()
            this.desabiledCar()

         }
      } catch (error) {
         console.error("Erro ao salvar produto:", error);
         console.log(data)
      }
   }


   CarregaFormGroup(produto?: any) {
      this.groupform = new FormGroup({
         productName: new FormControl(produto?.productName || '', Validators.required),
         price: new FormControl(produto?.price || '', [Validators.required, precoValidator]),
         peso: new FormControl(produto?.peso || 1, [Validators.required, pesoValidator]),
         categoriaId: new FormControl(produto?.categoriaProduct || '', Validators.required),
         description: new FormControl(produto?.description || '', Validators.required),
         amountQTD: new FormControl(produto?.amountQTD || '', Validators.required),
      });
   }



   isRequired(nome: string): boolean {
      const control = this.groupform.get(nome);
      if (!control) return false;

      const isTouched = control.touched;
      const hasRequiredError = control.errors?.['required'];


      return (hasRequiredError && isTouched);
   }

   focarPrimeiroCampo() {
      if (this.primeiroInput && this.primeiroInput.nativeElement) {
         this.primeiroInput.nativeElement.focus();
      }
   }

   focarProximoCampo(proximoCampo: string) {
      const proximo = document.querySelector(`[formControlName="${proximoCampo}"]`) as HTMLElement;
      if (proximo) {
         proximo.focus();
      }
   }

   isFormPreenchido(): boolean {
      const controls = this.groupform.controls;
      return Object.values(controls).every(control => {
         return control.valid && control.value !== null && control.value !== '';
      });
   }

   reloadRoute() {
      const currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
         this.router.navigate([currentUrl]);
      });
   }


   @ViewChild(MatAutocompleteTrigger) trigger!: MatAutocompleteTrigger;
   abrirAutocomplete() {
      if (!this.trigger.panelOpen) {
         this.trigger.openPanel();
      }
   }

   resetarCampoCategoria() {
      const control = this.groupform.get('categoriaId');
      if (control) {
         control.setValue('');
         // Garante que o painel autocomplete reabra com tudo
         setTimeout(() => {
            this.trigger.openPanel();
         });
      }
   }






}

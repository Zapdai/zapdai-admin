import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
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
import {Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
@Component({
   selector: "app-create-product",
   standalone: true,
   imports: [
      MatIconModule,
      MatButtonModule,
      AsyncPipe,
      ImageDropCarrosselComponent,
      ReactiveFormsModule,
      CommonModule,
      FormsModule,
      MatAutocompleteModule,
   ],

   templateUrl: "./create-product.component.html",
   styleUrls: ["./create-product.component.scss"],

})
export class CreateProductComponent implements OnInit {
   todosProdutos: any;
   produto: any;
   categorias: any[] = [];
   selectedValue: string = '';
   filteredStreets!: Observable<any> | undefined;

   files: File[] = [];
   preco: number = 0;
     control = new FormControl('');

   groupform!: FormGroup;
   @ViewChild('primeiroInput') primeiroInput!: ElementRef;
   @Output() desbiledCarEmit = new EventEmitter<void>();

   constructor(
      private api: ApiV1Loja,
      private apiCadastroProdutos: ProdutosApiService,
      private snack: SnackService,
      private router: Router,
      public authDecodeUser: AuthDecodeService,
   ) { }

   ngOnInit(): void {
      this.CarregaFormGroup();
      this.getAllProdutosEmpresa();
      this.getAllCategorias();
      this.filteredStreets = this.groupform.get("categoriaId")?.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '' ) ),
    );
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
      this.files = files;
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
      if (this.files.length === 0) {
         this.snack.error("Adicione pelo menos uma imagem do produto.");
         return;
      }
      

      const data: any = {
         
         idEmpresa: this.authDecodeUser.getEmpresaId(),
         productName: this.groupform.get('productName')?.value,
         price: this.groupform.get('price')?.value,
         peso: this.groupform.get('peso')?.value,
         categoria: { id: Number(this.groupform.get('categoriaId')?.value) },
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


   CarregaFormGroup() {
      this.groupform = new FormGroup({
         productName: new FormControl('', Validators.required),
         price: new FormControl(
            { value: '', disabled: false },
            {
               validators: [Validators.required, precoValidator],
               asyncValidators: [], // se tiver algum async
               updateOn: 'change' // ou 'blur' se preferir
            }
         ),
         peso: new FormControl(
            { value: 1, disabled: false },
            {
               validators: [Validators.required, pesoValidator],
               asyncValidators: [], // se tiver algum async
               updateOn: 'change' // ou 'blur' se preferir
            }
         ),
         categoriaId: new FormControl('', Validators.required),
         description: new FormControl('', Validators.required),
         amountQTD: new FormControl('', Validators.required),
      })
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
   abrirAutocomplete(){
 this.filteredStreets = of(this.categorias); 

  // Espera o DOM estabilizar e abre o autocomplete
  setTimeout(() => {
    this.trigger.openPanel();
  });
   }
  

}

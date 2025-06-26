import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { firstValueFrom, map, of, startWith } from "rxjs";
import { ApiV1Loja } from "../../../../../services/apiCategorias/apiV1Loja.service";
import { ProdutosApiService } from "../../../../../services/produtoService/produtosApi.service";
import { SnackService } from "../../../../../services/snackBar/snack.service";
import { Router } from "@angular/router";
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule, Validators } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { AuthDecodeService } from "../../../../../services/AuthUser.service";
import { Observable } from 'rxjs';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
   selector: "app-categorias",
   standalone: true,
   imports: [
      MatIconModule,
      MatButtonModule,
      ReactiveFormsModule,
      CommonModule,
      FormsModule,
      MatAutocompleteModule,
   ],
   schemas: [CUSTOM_ELEMENTS_SCHEMA],

   templateUrl: "./categorias.component.html",
   styleUrls: ["./categorias.component.scss"],
   animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]

})
export class CategoriasComponent implements OnInit, AfterViewInit {
   categorias: any[] = [];
   selectedValue: string = '';
   filteredStreets!: Observable<any> | undefined;
   activeTab = 'category';
   files: File[] = [];
   preco: number = 0;
   control = new FormControl('');

   groupform!: FormGroup;
   @Output() CategoriaEmit = new EventEmitter<void>();

   constructor(
      private api: ApiV1Loja,
      private apiCadastroProdutos: ProdutosApiService,
      private snack: SnackService,
      private router: Router,
      public authDecodeUser: AuthDecodeService,
   ) { }

   ngAfterViewInit() {
      const container = document.querySelector('.container');
      if (container) {
         container.addEventListener('scroll', () => {
            this.trigger.updatePosition(); // força o overlay a reposicionar
         });
      }
   }


   async ngOnInit(): Promise<void> {
      this.CarregaFormGroup();
      await this.getAllCategorias(); // Garante que as categorias estejam carregadas

      this.filteredStreets = this.groupform.get("categoriaId")?.valueChanges.pipe(
         startWith(''),
         map(value => this._filter(value || '')),
      );
   }

   setTab(tab: string) {
      this.activeTab = tab;
      this.getAllCategorias()
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
      this.CategoriaEmit.emit();
   }

   filhoClicado(event: Event) {
      event.stopPropagation();
   }

   CarregaFormGroup() {
      this.groupform = new FormGroup({
         categoryName: new FormControl('', Validators.required),
         categoriaId: new FormControl('', Validators.required),
      })
   }

   isRequired(nome: string): boolean {
      const control = this.groupform.get(nome);
      if (!control) return false;

      const isTouched = control.touched;
      const hasRequiredError = control.errors?.['required'];


      return (hasRequiredError && isTouched);
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
      const control = this.groupform.get('v');
      if (control) {
         control.setValue('');
         // Garante que o painel autocomplete reabra com tudo
         setTimeout(() => {
            this.trigger.openPanel();
         });
      }
   }






}

import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, OnInit, Output, PLATFORM_ID, ViewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { firstValueFrom, map, of, startWith } from "rxjs";
import { Router } from "@angular/router";
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule, Validators } from "@angular/forms";
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AuthDecodeService } from "../../../services/AuthUser.service";


@Component({
   selector: "app-maps-leaflet",
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

   templateUrl: "./maps-leaflet.component.html",
   styleUrls: ["./maps-leaflet.component.scss"],

})
export class MapsLeafletComponent implements OnInit, AfterViewInit {
   @Output() emitdesabiledCar = new EventEmitter<void>();
   @ViewChild('mapRef') mapRef!: ElementRef<HTMLDivElement>;

   map!: L.Map;
   marker!: L.Marker;
   formEndereco = {
      lat: 0,
      lng: 0,
      endereco: ''
   };

   groupform = new FormGroup({
      endereco: new FormControl('', Validators.required),
      latitude: new FormControl(''),
      longitude: new FormControl(''),
      // outros campos...
   });


   constructor(
      @Inject(PLATFORM_ID) private platformId: Object,
      private router: Router,
      public authDecodeUser: AuthDecodeService,
   ) { }

   ngAfterViewInit(): void {
      if (isPlatformBrowser(this.platformId)) {
         // Espera o elemento #map ter altura
         const ro = new ResizeObserver(entries => {
            for (let entry of entries) {
               const height = entry.contentRect.height;
               if (height > 0) {
                  this.initMap(); // só inicia o mapa se tiver altura visível
                  ro.disconnect(); // para de observar depois
               }
            }
         });

         ro.observe(this.mapRef.nativeElement);
      }
   }


   ngOnInit(): void {
      if (isPlatformBrowser(this.platformId)) {
         // Espera o elemento #map ter altura
         const ro = new ResizeObserver(entries => {
            for (let entry of entries) {
               const height = entry.contentRect.height;
               if (height > 0) {
                  this.initMap(); // só inicia o mapa se tiver altura visível
                  ro.disconnect(); // para de observar depois
               }
            }
         });

         ro.observe(this.mapRef.nativeElement);
      }
   }

   desabiledCar() {
      this.emitdesabiledCar.emit();
   }

   filhoClicado(event: Event) {
      event.stopPropagation();
   }

   private async initMap(): Promise<void> {
      const L = await import('leaflet');

      this.map = L.map('map').setView([-2.6320207, -44.2573765], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
         attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      this.map.on('click', (e: any) => {
         const { lat, lng } = e.latlng;

         if (this.marker) {
            this.marker.setLatLng([lat, lng]);
         } else {
            this.marker = L.marker([lat, lng]).addTo(this.map);
         }

         this.formEndereco.lat = lat;
         this.formEndereco.lng = lng;
         this.getEndereco(lat, lng);
      });

      // 👇 Essa linha força o mapa a recalcular tamanho após ser exibido
      setTimeout(() => {
         this.map.invalidateSize();
      }, 2000);
   }



   private getEndereco(lat: number, lng: number): void {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;

      fetch(url)
         .then(res => res.json())
         .then(data => {
            this.formEndereco.endereco = data.display_name || 'Endereço não encontrado';
         })
         .catch(() => {
            this.formEndereco.endereco = 'Erro ao buscar endereço';
         });
   }

   salvarEndereco() {
      if (this.formEndereco.endereco) {
         console.log('Endereço salvo:', this.formEndereco);
         // aqui você pode salvar no FormGroup:
         this.groupform.patchValue({
            endereco: this.formEndereco.endereco,
            latitude: this.formEndereco.lat.toString(),
            longitude: this.formEndereco.lng.toString()
         });

         this.desabiledCar(); // fecha modal
      } else {
         alert('Por favor, selecione um ponto no mapa.');
      }
   }


}

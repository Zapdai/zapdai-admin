import {
   Component, OnInit, ViewChild, ElementRef, Inject, NgZone,
   AfterViewInit,
   EventEmitter,
   Output,
   OnDestroy
} from '@angular/core';
import {
   FormGroup, FormControl, Validators,
   ReactiveFormsModule
} from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { validarCep } from '../../../../validators';
import { cepApiBrasilService } from '../../../services/cepApiBrasil/cep.service';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { MatIconModule } from '@angular/material/icon';
import { SnackService } from '../../../services/snackBar/snack.service';
import { ModalScrollService } from '../../../features/pages/modal-scroll.service';


@Component({
   selector: 'app-maps-google',
   templateUrl: './maps-google.component.html',
   styleUrls: ['./maps-google.component.scss'],
   standalone: true,
   imports: [
      GoogleMapsModule,
      ReactiveFormsModule,
      CommonModule,
      MatIconModule,
   ]
})



export class MapsGoogleComponent implements OnInit, AfterViewInit, OnDestroy {
   @ViewChild('primeiroInput') primeiroInput!: ElementRef;
   @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
   @ViewChild(GoogleMap) map!: GoogleMap;

   @Output() desbiledCarEmit = new EventEmitter<void>();
   @Output() enderecoConfirmado = new EventEmitter<any>();

   center: google.maps.LatLngLiteral = { lat: -23.55052, lng: -46.633308 };
   zoom = 18;

   groupform!: FormGroup;

   markerPosition: google.maps.LatLngLiteral = this.center;
   mapOptions: google.maps.MapOptions = {
      mapTypeId: 'roadmap',
      zoomControl: false,
      gestureHandling: 'greedy',
      fullscreenControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      rotateControl: false,           // Remove o controle de rotação
      scaleControl: false,            // Remove a escala
      panControl: false,
   };
   geocoder!: google.maps.Geocoder;
   isMapMoving = false;


   constructor(
      @Inject(PLATFORM_ID) private platformId: Object,
      private cepApi: cepApiBrasilService,
      private ngZone: NgZone,
      private snack: SnackService,
      private scrollService: ModalScrollService,
   ) { }

   
   ngOnDestroy(): void {
      this.scrollService.unlockScroll();
   }

   ngAfterViewInit(): void {
      setTimeout(() => {
         if (this.map?.googleMap) {
            google.maps.event.trigger(this.map.googleMap, 'resize');
            this.addCurrentLocationButton();
            this.obterLocalizacaoAtualCompleta();
            requestAnimationFrame(() => {
               this.initAutocomplete();
            });
         }
      }, 1000);
      this.geocoder = new google.maps.Geocoder();

   }

   ngOnInit(): void {
      this.scrollService.lockScroll();

      this.initForm();
      this.getCurrentLocation();
      this.groupform.get('cep')?.valueChanges.subscribe((cep: string) => {
         const sanitized = cep?.replace(/\D/g, '');
         if (sanitized?.length === 8) {
            this.buscarEnderecoPorCep(sanitized);
         }
      });
   }

   desabiledCar() {
      this.desbiledCarEmit.emit();
   }

   filhoClicado(event: Event) {
      event.stopPropagation();
   }

   initForm() {
      this.groupform = new FormGroup({
         cep: new FormControl('', [Validators.required, validarCep]),
         estado_sigla: new FormControl('', Validators.required),
         cidade: new FormControl('', Validators.required),
         bairro: new FormControl('', Validators.required),
         rua: new FormControl('', Validators.required),
         numeroEndereco: new FormControl('', Validators.required),
         complemento: new FormControl('')
      });
   }



   private mapMovingTimeout: any;

   onMapCenterChanged() {
      this.isMapMoving = true;

      // Limpa o timeout anterior, se ainda estiver contando
      if (this.mapMovingTimeout) {
         clearTimeout(this.mapMovingTimeout);
      }

      // Se o centro ficar parado por 400ms, considera que parou de mover
      this.mapMovingTimeout = setTimeout(() => {
         this.isMapMoving = false;

         const center = this.map?.googleMap?.getCenter();
         if (center) {
            const lat = center.lat();
            const lng = center.lng();
            this.ngZone.run(() => {
               this.markerPosition = { lat, lng };
               this.buscarEnderecoPorLatLng(lat, lng);
               this.obterLocalizacaoAtualCompleta();
            });
         }
      }, 400);
   }


   onMapIdle() {
      this.isMapMoving = false;

      const center = this.map?.googleMap?.getCenter();
      if (center) {
         const lat = center.lat();
         const lng = center.lng();

         this.ngZone.run(() => {
            this.markerPosition = { lat, lng };
            this.buscarEnderecoPorLatLng(lat, lng);
         });
      }
   }




   initAutocomplete() {
      const input = this.searchInput.nativeElement;
      const autocomplete = new google.maps.places.Autocomplete(input, {
         fields: ['geometry', 'formatted_address', 'address_components', 'name'],
         types: []
      });

      autocomplete.addListener('place_changed', () => {
         const place = autocomplete.getPlace();

         if (!place.geometry?.location) {
           this.snack.error('❌ Local sem coordenadas.');
            return;
         }

         const lat = place.geometry.location.lat();
         const lng = place.geometry.location.lng();

         this.ngZone.run(() => {
            this.center = { lat, lng };
            this.markerPosition = { lat, lng };
            this.buscarEnderecoPorLatLng(lat, lng);
         });
      });
   }



   addCurrentLocationButton() {
      const controlDiv = document.createElement('div');
      controlDiv.style.margin = '40px 10px';

      const button = document.createElement('button');
      button.title = 'Minha localização';

      // Estilos aplicados diretamente
      button.style.backgroundColor = '#fff';
      button.style.border = 'none';
      button.style.borderRadius = '50%';
      button.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
      button.style.width = '40px';
      button.style.height = '40px';
      button.style.cursor = 'pointer';
      button.style.display = 'flex';
      button.style.alignItems = 'center';
      button.style.justifyContent = 'center';
      button.style.padding = '0';

      const icon = document.createElement('span'); // span, não mat-icon
      icon.className = 'material-icons';
      icon.textContent = 'my_location';
      icon.style.fontSize = '24px';
      icon.style.color = '#444';

      button.appendChild(icon);
      controlDiv.appendChild(button);

      button.addEventListener('click', () => {
         navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            this.center = { lat, lng };
            this.markerPosition = { lat, lng };
            this.map.googleMap?.panTo(this.center);
         });
      });

      this.map.googleMap?.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
   }

   obterLocalizacaoAtualCompleta() {
      navigator.geolocation.getCurrentPosition(
         (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            this.geocoder.geocode({ location: { lat, lng } }, (results, status) => {
               if (status === 'OK' && results?.[0]) {
                  const endereco = this.extrairCamposEndereco(results[0]);

               } else {
                  this.snack.error('❌ Não foi possível obter o endereço completo.');
               }
            });
         },
         (error) => {
            this.snack.error('Erro ao obter localização:' + error.message);
         },
         { enableHighAccuracy: true }
      );
   }


   getCurrentLocation() {
      navigator.geolocation.getCurrentPosition(
         (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            this.center = { lat, lng };
            this.markerPosition = { lat, lng };
         },
         (error) => {
            this.snack.error('Erro ao obter localização:' + error.message);
         },
         { enableHighAccuracy: true }
      );
   }

   buscarEnderecoPorCep(cep: string) {
      this.cepApi.consultarCep(cep).subscribe((res: any) => {
         if (!res.erro) {
            this.groupform.patchValue({
               estado_sigla: res.state,
               cidade: res.city,
               bairro: res.neighborhood,
               rua: res.street
            });
         }
      });
   }

   buscarEnderecoPorLatLng(lat: number, lng: number) {
      this.geocoder.geocode({ location: { lat, lng } }, (results, status) => {
         if (status === 'OK' && results && results.length > 0) {
            // Ordenar resultados por proximidade e se possui rua
            const resultadoComRuaMaisProximo = results.find(result =>
               result.address_components.some(c => c.types.includes('route'))
            );

            const melhorResultado = resultadoComRuaMaisProximo || results[0];

            const endereco = this.extrairCamposEndereco(melhorResultado);
            this.groupform.patchValue(endereco);
         } else {
            this.snack.error('❌ Nenhum resultado do Geocoder.');
         }
      });
   }


   extrairCamposEndereco(result: google.maps.GeocoderResult) {
      const components = result.address_components;

      const get = (types: string[]) =>
         components.find((c) => types.some((t) => c.types.includes(t)))?.long_name || '';

      let rua = get(['route', 'point_of_interest', 'premise']);

      // fallback: tentar extrair rua manualmente do formatted_address
      if (!rua && result.formatted_address) {
         const partes = result.formatted_address.split(',');
         if (partes.length > 0) {
            rua = partes[0]; // geralmente a primeira parte é a rua
         }
      }

      return {
         estado_sigla: get(['administrative_area_level_1']),
         cidade: get(['administrative_area_level_2', 'locality']),
         bairro: get(['sublocality', 'neighborhood', 'political']),
         rua,
         numeroEndereco: get(['street_number']),
         complemento: '',
         cep: get(['postal_code'])

      };
   }


   confirmarEndereco() {
      const endereco = this.groupform.value;
      const coordenadas = this.markerPosition;

      // Aqui você pode enviar para o backend, emitir evento ou salvar localmente
      const payload = {
         ...endereco,
         latitude: coordenadas.lat,
         longitude: coordenadas.lng,
      };

      // Exemplo: emitir para componente pai
      this.enderecoConfirmado.emit(payload);
      this.desabiledCar()
   }




   focarProximoCampo(nome: string) {
      const proximo = document.querySelector(`[formControlName="${nome}"]`) as HTMLElement;
      if (proximo) proximo.focus();
   }

   isRequired(campo: string): boolean {
      const ctrl = this.groupform.get(campo);
      return !!ctrl && ctrl.touched && ctrl.errors?.['required'];
   }
}
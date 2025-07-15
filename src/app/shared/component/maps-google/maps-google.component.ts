import {
   Component, OnInit, ViewChild, ElementRef, Inject, NgZone,
   AfterViewInit,
   EventEmitter,
   Output
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



export class MapsGoogleComponent implements OnInit, AfterViewInit {
   @ViewChild('primeiroInput') primeiroInput!: ElementRef;
   @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
   @ViewChild(GoogleMap) map!: GoogleMap;

   @Output() desbiledCarEmit = new EventEmitter<void>();

   center: google.maps.LatLngLiteral = { lat: -23.55052, lng: -46.633308 };
   zoom = 15;

   groupform!: FormGroup;

   markerPosition: google.maps.LatLngLiteral = this.center;
   mapOptions: google.maps.MapOptions = {
      mapTypeId: 'roadmap',
      zoomControl: true,
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
      private ngZone: NgZone
   ) { }

   ngAfterViewInit(): void {
      setTimeout(() => {
         if (this.map?.googleMap) {
            google.maps.event.trigger(this.map.googleMap, 'resize');
            this.addCurrentLocationButton();
            this.obterLocalizacaoAtualCompleta();
         }
      }, 1000);
      this.initAutocomplete();
      this.geocoder = new google.maps.Geocoder();
   }

   ngOnInit(): void {
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
      console.log('✅ Mapa parou de mover');

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
      const autocomplete = new google.maps.places.Autocomplete(input);

      // Define quais campos queremos receber
      autocomplete.setFields([
         'place_id',
         'geometry',
         'formatted_address',
         'address_components',
         'name'
      ]);

      autocomplete.addListener('place_changed', () => {
         const place = autocomplete.getPlace();

         if (!place.geometry?.location) {
            console.warn('❌ Local sem coordenadas.');
            return;
         }

         const lat = place.geometry.location.lat();
         const lng = place.geometry.location.lng();

         this.ngZone.run(() => {
            this.center = { lat, lng };
            this.markerPosition = { lat, lng };
            this.buscarEnderecoPorLatLng(lat, lng);

            console.log('📍 Nome do lugar:', place.name);
            console.log('📍 Endereço formatado:', place.formatted_address);
            console.log('📍 Componentes de endereço:', place.address_components);
         });
      });
   }


   addCurrentLocationButton() {
      const controlDiv = document.createElement('div');
      controlDiv.style.margin = '10px';

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

            console.log('📍 Latitude:', lat);
            console.log('📍 Longitude:', lng);

            this.geocoder.geocode({ location: { lat, lng } }, (results, status) => {
               if (status === 'OK' && results?.[0]) {
                  const endereco = this.extrairCamposEndereco(results[0]);

                  console.log('📍 Estado:', endereco.estado_sigla);
                  console.log('📍 CEP:', endereco.cep);
                  console.log('📍 Bairro:', endereco.bairro);
                  console.log('📍 Cidade:', endereco.cidade);
                  console.log('📍 Rua:', endereco.rua);

                  console.log('🔍 Resultados brutos do Geocoder:', results);
               } else {
                  console.warn('❌ Não foi possível obter o endereço completo.');
               }
            });
         },
         (error) => {
            console.error('Erro ao obter localização:', error.message);
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
            console.warn('Erro ao obter localização:', error.message);
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
         if (status === 'OK' && results?.[0]) {
            const endereco = this.extrairCamposEndereco(results[0]);
            this.groupform.patchValue(endereco);
         }
      });
   }

   extrairCamposEndereco(result: google.maps.GeocoderResult) {
      const components = result.address_components;
      const get = (types: string[]) =>
         components.find((c) => types.some((t) => c.types.includes(t)))?.long_name || '';

      return {
         estado_sigla: get(['administrative_area_level_1']),
         cidade: get(['administrative_area_level_2', 'locality']),
         bairro: get(['sublocality', 'neighborhood', 'political']),
         rua: get(['route', 'street_address', 'point_of_interest']),
         numeroEndereco: get(['street_number']),
         complemento: '',
         cep: get(['postal_code'])

      };
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
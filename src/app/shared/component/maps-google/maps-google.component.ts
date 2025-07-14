import {
   Component, OnInit, ViewChild, ElementRef, Inject, NgZone,
   AfterViewInit
} from '@angular/core';
import {
   FormGroup, FormControl, Validators,
   ReactiveFormsModule
} from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { validarCep } from '../../../../validators';
import { cepApiBrasilService } from '../../../services/cepApiBrasil/cep.service';
import { GoogleMapsModule } from '@angular/google-maps';


@Component({
   selector: 'app-maps-google',
   templateUrl: './maps-google.component.html',
   styleUrls: ['./maps-google.component.scss'],
   standalone: true,
   imports: [GoogleMapsModule, ReactiveFormsModule, CommonModule,]
})



export class MapsGoogleComponent implements OnInit, AfterViewInit {
   @ViewChild('primeiroInput') primeiroInput!: ElementRef;
   @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

   groupform!: FormGroup;

   center: google.maps.LatLngLiteral = { lat: -23.55052, lng: -46.633308 };
   zoom = 15;
   markerPosition: google.maps.LatLngLiteral = this.center;
   mapOptions: google.maps.MapOptions = { mapTypeId: 'roadmap', zoomControl: true };
   markerOptions: google.maps.MarkerOptions = { draggable: true };

   geocoder!: google.maps.Geocoder;

   constructor(
      @Inject(PLATFORM_ID) private platformId: Object,
      private cepApi: cepApiBrasilService,
      private ngZone: NgZone
   ) { }

   ngAfterViewInit(): void {

      if (isPlatformBrowser(this.platformId)) {
         this.geocoder = new google.maps.Geocoder();
         this.initAutocomplete();
         this.getCurrentLocation();
      }
   }

   ngOnInit(): void {
      this.initForm();

      this.groupform.get('cep')?.valueChanges.subscribe((cep: string) => {
         const sanitized = cep?.replace(/\D/g, '');
         if (sanitized?.length === 8) {
            this.buscarEnderecoPorCep(sanitized);
         }
      });

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

   onMapClick(event: google.maps.MapMouseEvent) {
      const latLng = event.latLng;
      if (!latLng) return;

      const lat = latLng.lat();
      const lng = latLng.lng();

      this.ngZone.run(() => {
         this.markerPosition = { lat, lng };
         this.center = { lat, lng };
         this.buscarEnderecoPorLatLng(lat, lng);
      });
      console.log(lat, lng)
   }

   onMarkerDragEnd(event: google.maps.MapMouseEvent) {
      const latLng = event.latLng;
      if (!latLng) return;

      const lat = latLng.lat();
      const lng = latLng.lng();

      this.ngZone.run(() => {
         this.markerPosition = { lat, lng };
         this.buscarEnderecoPorLatLng(lat, lng);
      });
   }

   initAutocomplete() {
      const input = this.searchInput.nativeElement;
      const autocomplete = new google.maps.places.Autocomplete(input, {
         types: ['address']
      });

      autocomplete.addListener('place_changed', () => {
         const place = autocomplete.getPlace();
         if (place.geometry?.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();

            this.ngZone.run(() => {
               this.markerPosition = { lat, lng };
               this.center = { lat, lng };
               this.buscarEnderecoPorLatLng(lat, lng);
            });
         }
      });
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
      const get = (type: string) =>
         components.find((c) => c.types.includes(type))?.long_name || '';
      return {
         estado_sigla: get('administrative_area_level_1'),
         cidade: get('administrative_area_level_2'),
         bairro: get('sublocality') || get('neighborhood'),
         rua: get('route'),
         numeroEndereco: get('street_number'),
         complemento: '',
         cep: get('postal_code')
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

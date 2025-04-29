import { AfterViewInit, Component, ElementRef, Inject, inject, OnDestroy, PLATFORM_ID, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-carrossel',
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: './carrossel.component.html',
  styleUrl: './carrossel.component.scss'
})
export class CarrosselComponent implements AfterViewInit, OnDestroy {

  @ViewChild("radio1") radio1!: ElementRef;
  @ViewChild("radio2") radio2!: ElementRef;
  numero = 0; // Começa no primeiro slide
  intervalId!: ReturnType<typeof setInterval>;
  constructor(@Inject(PLATFORM_ID) private plataformaId: object) { }

  ngAfterViewInit(): void {
      if (isPlatformBrowser(this.plataformaId)) {
        this.numero = 1;
        this.intervalId = setInterval(()=>{
          this.nextImg();
        }, 4000); // A cada 2 segundos

      }
   

  }
  nextImg() {
    this.numero++;
    if (this.numero > 3) {
      this.numero = 1;
    }
    const radio = document.getElementById("radio" + this.numero) as HTMLInputElement;
    if (radio) {
      radio.checked = true;
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }


}
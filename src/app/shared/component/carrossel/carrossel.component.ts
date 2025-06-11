import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, PLATFORM_ID, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-carrossel',
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: './carrossel.component.html',
  styleUrl: './carrossel.component.scss'
})
export class CarrosselComponent implements AfterViewInit, OnDestroy {
   constructor(@Inject(PLATFORM_ID) private id:Object){}
  @ViewChild("radio1") radio1!: ElementRef;
  @ViewChild("radio2") radio2!: ElementRef;
  numero = 0; // Começa no primeiro slide
  intervalId!: ReturnType<typeof setInterval>;
  ngAfterViewInit(): void {
       if(isPlatformBrowser(this.id)){
        this.numero = 1;
        this.intervalId = setInterval(()=>{
          this.nextImg();
        }, 4000); // A cada 2 segundos

       }
      
   

  }
  nextImg() {
    this.numero++;
    if (this.numero > 4) {
      this.numero = 1;
    }
    if(isPlatformBrowser(this.id)){
      const radio = document.getElementById("radio" + this.numero) as HTMLInputElement;
      if (radio) {
        radio.checked = true;
      }
    }
    
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
    
  }


}
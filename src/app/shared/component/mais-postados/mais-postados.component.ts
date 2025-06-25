import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { UtiusComponent } from '../utius/utius.component';
import { ModalComponent } from '../modal/modal.component';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mais-postados',
  imports: [UtiusComponent,ModalComponent,MatIconModule],
  templateUrl: './mais-postados.component.html',
  styleUrl: './mais-postados.component.scss'
})
export class MaisPostadosComponent {
  @Input() empresa?:any;
  @ViewChild("scrollContainer",{static:false}) fer?:ElementRef;
  @Input() produto:any;
  @Input() ativo?:boolean
  constructor(private rotas:Router){}
  rolarDireita(){
      this.fer?.nativeElement.scrollBy({
          left:-200,
          behavior: 'smooth'
      })
  }
  rolarEsquerda(){
      this.fer?.nativeElement.scrollBy({
          left:200,
          behavior: 'smooth'
      })
  }
  rodaFunc(event:any){

   this.rotas.navigateByUrl(`produto/detalhes/${event}`)
  }
  produtoEmpres(event:any){
       this.rotas.navigate([`empresa/produto`, event])

  }

} 

import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { UtiusComponent } from '../utius/utius.component';
import { ModalComponent } from '../modal/modal.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-mais-postados',
  imports: [UtiusComponent,ModalComponent,MatIconModule],
  templateUrl: './mais-postados.component.html',
  styleUrl: './mais-postados.component.scss'
})
export class MaisPostadosComponent {
  @Input() titulo?:string;
  @ViewChild("scrollContainer",{static:false}) fer?:ElementRef;
  @Input() produto:any;
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
  imagem = "https://cdn.casaeculinaria.com/wp-content/uploads/2023/04/05163949/Hamburguer-artesanal.webp"
  imagem2 = "https://www.mundoboaforma.com.br/wp-content/uploads/2020/10/Hamburguer.jpg"

  imagem3 = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9A5I3P4rt1kftXxVds7cQWs306znK9nrmdA&s"

  imagem4 = "https://static.itdg.com.br/images/640-440/49687a8a7a7110c7f560b9c7e96a9d0e/254679-shutterstock-364110890-1-.jpg"
  titulo2 = "Humburguer caseiro simples "
  titulo3 = "Humburguer Mexicano "
  titulo4 = " Hambúrguer com queijo prato "
  titulo5 = "Hambúrguer com cebola caramelizada e bacon" 

  titulo6 = "Hambúrguer Angus com Fatias Redondas de Bacon" 


} 

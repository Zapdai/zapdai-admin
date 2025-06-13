import { Component, Input, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-utius',
  imports: [MatButtonModule],
  templateUrl: './utius.component.html',
  styleUrl: './utius.component.scss'
})
export class UtiusComponent {
  @Input() imagem?:string;
  @Input() imagem2?:string;
  @Input() imagem3?:string;
   @Input() titulo?:string;
   detalhes(){
    alert("deu certo")
   }

}

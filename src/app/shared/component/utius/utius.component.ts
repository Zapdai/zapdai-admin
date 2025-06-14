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
   @Input() titulo?:string;
  @Input() price?:number;

   detalhes(){
    alert("deu certo")
   }

}

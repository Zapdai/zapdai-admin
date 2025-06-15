import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-utius',
  imports: [MatButtonModule],
  templateUrl: './utius.component.html',
  styleUrl: './utius.component.scss'
})
export class UtiusComponent {

  @Input() imagem?:string;
    @Output() emiter = new EventEmitter();

   @Input() titulo?:string;
  @Input() price?:number;
  nome:any
   constructor(private router:ActivatedRoute){}
   detalhes(){
     this.emiter.emit()
   }

}

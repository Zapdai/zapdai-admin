import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-opcoes-categoria',
  imports: [],
  templateUrl: './opcoes-categoria.component.html',
  styleUrl: './opcoes-categoria.component.scss'
})
export class OpcoesCategoriaComponent {
 @Input() url?:string;
 @Input() name?:string
 @Output() idevent = new EventEmitter();

 navigate(){
  this.idevent.emit()
 }
}




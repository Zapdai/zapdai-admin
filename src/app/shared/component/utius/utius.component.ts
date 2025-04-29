import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-utius',
  imports: [],
  templateUrl: './utius.component.html',
  styleUrl: './utius.component.scss'
})
export class UtiusComponent {
  @Input() imagem?:string;
}

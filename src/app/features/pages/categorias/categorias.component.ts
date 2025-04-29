import { Component } from '@angular/core';
import { headerComponent } from '../home/header/header.component';
import { DestaqueComponent } from '../destaque/destaque.component';

@Component({
  selector: 'app-categorias',
  imports: [headerComponent,DestaqueComponent],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss'
})
export class CategoriasComponent {

}

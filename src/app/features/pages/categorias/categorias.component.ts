import { Component } from '@angular/core';
import { headerComponent } from '../home/header/header.component';
import { DestaqueComponent } from '../destaque/destaque.component';
import { CarrosselComponent } from '../../../shared/component/carrossel/carrossel.component';
import { OpcoesCategoriaComponent } from '../../../shared/component/opcoes-categoria/opcoes-categoria.component';
import { ModalComponent } from '../../../shared/component/modal/modal.component';
import { MaisPostadosComponent } from '../../../shared/component/mais-postados/mais-postados.component';
import { PageContainerComponent } from "../../../shared/component/page-container/page-container.component";
import { footerComponent } from "../home/foother/footer.component";

@Component({
  selector: 'app-categorias',
  imports: [headerComponent, OpcoesCategoriaComponent, CarrosselComponent, MaisPostadosComponent, PageContainerComponent, footerComponent],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss'
})
export class CategoriasComponent {
  img = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIPos0lHAdWx4H3yvlwjB9VARehWHZz39s7Q&s"
}

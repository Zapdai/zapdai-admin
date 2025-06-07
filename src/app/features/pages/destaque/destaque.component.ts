import { Component } from "@angular/core";
import { ModalComponent } from "../../../shared/component/modal/modal.component";
import { CarrosselComponent } from "../../../shared/component/carrossel/carrossel.component";
import { OpcoesCategoriaComponent } from "../../../shared/component/opcoes-categoria/opcoes-categoria.component";
import { MaisPostadosComponent } from "../../../shared/component/mais-postados/mais-postados.component";

@Component({
    selector:"app-destaque",
    standalone:true,
    imports: [ModalComponent, CarrosselComponent, OpcoesCategoriaComponent, MaisPostadosComponent],
    templateUrl:"./destaque.component.html",
    styleUrl:"./destaque.component.scss"
})
export class DestaqueComponent{}
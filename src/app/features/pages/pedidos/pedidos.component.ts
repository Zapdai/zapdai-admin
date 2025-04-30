import { Component } from "@angular/core";
import { searchComponent } from "../../../shared/component/search/search.component";


@Component ({
    selector: '',
    standalone: true,
    templateUrl: './pedidos.component.html',
    styleUrl: './pedidos.component.scss',
    imports: [searchComponent]
})

export class pedidosComponent {}
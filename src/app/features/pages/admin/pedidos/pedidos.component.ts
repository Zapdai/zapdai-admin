import { Component } from "@angular/core";
import { searchComponent } from "../../../../shared/component/search/search.component";
import { tableComponent } from "../../../../shared/component/table/table.component";


@Component ({
    selector: '',
    standalone: true,
    templateUrl: './pedidos.component.html',
    styleUrl: './pedidos.component.scss',
    imports: [searchComponent,tableComponent]
})

export class pedidosComponent {}
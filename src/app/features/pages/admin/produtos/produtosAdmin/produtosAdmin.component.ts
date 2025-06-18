import { Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector:"app-produtos",
    imports:[ MatIconModule, ReactiveFormsModule ],
    standalone:true,
    templateUrl:"./produtosAdmin.component.html",
    styleUrl:"./produtosAdmin.component.scss"
})
export class ProdutosAdminComponent{

    groupSearh = new FormGroup({
        name: new FormControl("")
    })

    pegarvalor() {
        const name = this.groupSearh.get("name")?.value;
        alert("valor digitado " + name)
    }
}
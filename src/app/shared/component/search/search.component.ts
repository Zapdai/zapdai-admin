import { Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import {MatButtonModule} from '@angular/material/button';
import { nomeService } from "../../../services/nome.service";

@Component ({
    selector: 'app-search',
    standalone: true,
    imports: [MatButtonModule,ReactiveFormsModule],
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss'
})

export class searchComponent {
    form = new FormGroup({
        busca: new FormControl("")
    })
    constructor(public nome:nomeService){}
    pegaValor(){
      const valor:any =  this.form.get("busca")?.value
       this.nome.pegaValor(valor);
    }
}
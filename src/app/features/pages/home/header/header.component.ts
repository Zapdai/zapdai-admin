import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';


@Component({
    selector:"app-header",
    templateUrl:"./header.component.html",
    styleUrl:"./header.component.scss",
    standalone:true,
    imports:[MatIconModule,CommonModule,MatIconModule,ReactiveFormsModule]
})
export class headerComponent{
    @Input() categoria?:string;
    @Input() usuario = false;
    @Input() carrinho = false;
    grupo = new FormGroup({
        name:new FormControl("")
    })
    @Output() ativaMenu = new EventEmitter;
    setIcon(mudaIcon: boolean) {
        if (mudaIcon) {
            return "keyboard_arrow_down"
        } else {
            return "chevron_right"
        }

    }
    pegarvalor(){
       const name = this.grupo.get("name")?.value;
       alert("valor digitado "+name)
    }
    light(){
        alert("Clicou")
    }
exibir(){
    this.ativaMenu.emit()
}
}
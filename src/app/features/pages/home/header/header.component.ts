import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Output } from "@angular/core";
import {MatIconModule} from '@angular/material/icon';
@Component({
    selector:"app-header",
    templateUrl:"./header.component.html",
    styleUrl:"./header.component.scss",
    standalone:true,
    imports:[MatIconModule,CommonModule]
})
export class headerComponent{
    @Output() ativaMenu = new EventEmitter;
    setIcon(mudaIcon: boolean) {
        if (mudaIcon) {
            return "keyboard_arrow_down"
        } else {
            return "chevron_right"
        }

    }
    light(){
        alert("Clicou")
    }
exibir(){
    this.ativaMenu.emit()
}
}
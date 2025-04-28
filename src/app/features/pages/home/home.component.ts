import { Component } from "@angular/core";
import { headerComponent } from "./header/header.component";
import { menuDropComponent } from "./menuDropDown/menudrop.component";
import { RouterOutlet } from "@angular/router";
import { footerComponent } from "./foother/footer.component";

@Component({
    selector:"app-home",
    templateUrl:"./home.component.html",
    styleUrl:"./home.component.scss",
    standalone:true,
    imports:[headerComponent,menuDropComponent,RouterOutlet,footerComponent]
})
export class homeComponent{
    ativa = false;

    ativo(){
        this.ativa = !this.ativa;
    }

}
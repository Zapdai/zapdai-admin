import { Component, Input } from "@angular/core";
import { menuDropComponent } from "./menuDropDown/menudrop.component";
import { RouterOutlet } from "@angular/router";
import { headerComponent } from "../../../../shared/component/header/header.component";
import { MobileNavbarComponent } from "../../../../shared/component/mobile-navbar/mobile-navbar.component";
import { CobrancaComponent } from "../../../../shared/component/cobranca/cobranca.component";

@Component({
    selector:"app-home",
    templateUrl:"./home.component.html",
    styleUrl:"./home.component.scss",
    standalone:true,
    imports: [headerComponent, menuDropComponent, RouterOutlet, MobileNavbarComponent,CobrancaComponent]
})
export class homeComponent{
    @Input() desabled?: boolean; 
    ativa = true;

    ativo(){
        this.ativa = !this.ativa;
    }

}
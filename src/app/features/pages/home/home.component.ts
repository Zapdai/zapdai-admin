import { Component, Input } from "@angular/core";
import { headerComponent } from "./header/header.component";
import { menuDropComponent } from "./menuDropDown/menudrop.component";
import { RouterOutlet } from "@angular/router";
import { footerComponent } from "./foother/footer.component";
import { MobileNavbarComponent } from "./mobile-navbar/mobile-navbar.component";
import { PageContainerComponent } from "../../../shared/component/page-container/page-container.component";
import { CobrancaComponent } from "../../../shared/component/cobranca/cobranca.component";

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
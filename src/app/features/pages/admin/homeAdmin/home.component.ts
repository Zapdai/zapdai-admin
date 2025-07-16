import { Component, HostListener, Inject, Input, OnInit, PLATFORM_ID } from "@angular/core";
import { menuDropComponent } from "./menuDropDown/menudrop.component";
import { RouterOutlet } from "@angular/router";
import { headerComponent } from "../../../../shared/component/header/header.component";
import { isPlatformBrowser } from "@angular/common";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrl: "./home.component.scss",
    standalone: true,
    imports: [headerComponent, menuDropComponent, RouterOutlet]
})
export class homeComponent implements OnInit {
    @Input() desabled?: boolean;
    ativa = true;
    isVisible = false;

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
    ) { }

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.checkWindowSize();
        }

        if(!this.isVisible) {
            this.ativa = false;
        }
    }

    ativo() {
        this.ativa = !this.ativa;
    }


    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        if (isPlatformBrowser(this.platformId)) {
            this.checkWindowSize();
        }
    }

    checkWindowSize() {
        if (isPlatformBrowser(this.platformId)) {
            this.isVisible = window.innerWidth > 768;
        }
    }

}
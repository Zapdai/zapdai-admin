import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser, Location } from "@angular/common";
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: "",
    standalone: true,
    imports: [MatIconModule],
    templateUrl: "./unauthorized.component.html",
    styleUrl: "./unauthorized.component.scss"
})
export class UnauthorizedComponent implements OnInit {
    isVisible = false;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private location: Location,
    ) { }
    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.checkWindowSize();
        }
    }

    @HostListener('window:resize')
    onResize() {
        if (isPlatformBrowser(this.platformId)) {
            this.checkWindowSize();
        }
    }

    checkWindowSize() {
        this.isVisible = window.innerWidth <= 767;
    }


    voltarPaginaAnterior() {
        this.location.back();
    }

}
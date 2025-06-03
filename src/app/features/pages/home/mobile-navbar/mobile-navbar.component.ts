import {
    Component,
    HostListener,
    Inject,
    OnInit,
    PLATFORM_ID
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthDecodeService } from '../../../../services/AuthUser.service';
import { AuthService } from '../../../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-mobile-navbar',
    standalone: true,
    imports: [CommonModule, MatIconModule, RouterModule],
    templateUrl: './mobile-navbar.component.html',
    styleUrls: ['./mobile-navbar.component.scss']
})
export class MobileNavbarComponent implements OnInit {
    token: any;
    isVisible = false;

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private router: Router,
        public authDecodeUser: AuthDecodeService,
        private auth: AuthService
    ) { }

    ngOnInit(): void {
        this.token = this.auth.returnToken();

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
        this.isVisible = window.innerWidth <= 768;
    }

    navegar(rota: string): void {
        this.router.navigate([rota]);
    }

    perfilClick() {
        if (this.token != null) {
            this.router.navigate(['/gerenciar-conta']);
        } else {
            this.router.navigate(['/auth/signin']);
        }
    }
}

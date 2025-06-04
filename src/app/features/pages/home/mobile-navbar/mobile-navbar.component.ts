import {
  Component,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-mobile-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './mobile-navbar.component.html',
  styleUrls: ['./mobile-navbar.component.scss']
})
export class MobileNavbarComponent implements OnInit {
  isVisible = false;
  token: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public router: Router // <- public para uso no template
  ) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token'); // substitua se tiver outro método
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

  perfilClick(): void {
    if (this.token) {
      this.router.navigate(['/gerenciar-conta']);
    } else {
      this.router.navigate(['/auth/signin']);
    }
  }
}

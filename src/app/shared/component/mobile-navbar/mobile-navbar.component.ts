import {
  Component,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';
import { Usuario } from '../../core/types/usuario';
import { AuthDecodeService } from '../../../services/AuthUser.service';
import { apiAuthService } from '../../../services/apiAuth.service';

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
  isAdmin: boolean = false;
  usuario!: Usuario

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public router: Router,
    public auth: AuthService,
    public authDecodeUser: AuthDecodeService,
    private apiAuth: apiAuthService,
  ) { }

  ngOnInit(): void {
    // this.emailUser = this.authService.getFromToken('sub')!;
    this.isAdmin = this.router.url.startsWith('/admin');

    // Escuta mudanças de rota subsequentes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isAdmin = this.router.url.startsWith('/admin');
      }
    });


    this.token = this.auth.returnToken();


    if (this.auth.PossuiToken()) {
      this.buscaUsuario();
    }

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

  buscaUsuario() {
    this.apiAuth.buscaUsuario(this.authDecodeUser.getSub()).subscribe((usuario: Usuario) => {
      if (usuario !== null) {
        this.usuario = usuario;
      }
    })
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

import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { PageContainerComponent } from '../../../shared/component/page-container/page-container.component';
import { Router, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthDecodeService } from '../../../services/AuthUser.service';
import { AuthService } from '../../../services/auth.service';
import { loadingService } from '../../../services/loading/loading.service';
import { isPlatformBrowser, Location } from '@angular/common';
import { AsideComponent } from "../../../shared/component/aside-modal/aside-modal.component";
import { AvatarUserComponent } from "./avatarUser/avatarUser.component";
import { apiAuthService } from '../../../services/apiAuth.service';
import { Usuario } from '../../../shared/core/types/usuario';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [RouterOutlet, MatIconModule, PageContainerComponent, AsideComponent, AvatarUserComponent],
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss'],
})
export class MyAccountComponent implements OnInit {
  token: any;
  isVisible = false;
  modalAtivo = false;
  usuario!: Usuario;
  valida: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    public authDecodeUser: AuthDecodeService,
    private auth: AuthService,
    private activeRouter: loadingService,
    private location: Location,
    private apiAuth: apiAuthService,

  ) { }

  ngOnInit(): void {
    this.token = this.auth.returnToken();

    this.getUser()

    if (isPlatformBrowser(this.platformId)) {
      this.checkWindowSize();
    }

  }

  getUser() {
    new Promise((resove) => {
      resove(
        this.apiAuth.buscaUsuario(this.authDecodeUser.getSub()).subscribe((usuario: Usuario) => {
          this.valida = usuario;
          if (usuario !== null) {
            this.usuario = usuario;
          }
        })
      )
    })
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


  ativaModal() {
    this.modalAtivo = false;
  }

  abrirModalAlterarImagem() {
    this.modalAtivo = true
  }

  pageMyAccount() {
    this.activeRouter.activeLoading()
    setTimeout(() => {
      this.router.navigateByUrl('/loading', { skipLocationChange: true }).then(() => {
        setTimeout(() => {
          this.router.navigate(['/my-account'])
        }, 1000);
      })

    }, 0);
  }
  pageHome() {
    this.activeRouter.activeLoading()
    setTimeout(() => {
      this.router.navigateByUrl('/loading', { skipLocationChange: true }).then(() => {
        setTimeout(() => {
          this.router.navigate(['/home'])
        }, 1000);
      })

    }, 0);
  }


  pageManagerProfile() {
    this.activeRouter.activeLoading()
    setTimeout(() => {
      this.router.navigateByUrl('/loading', { skipLocationChange: true }).then(() => {
        setTimeout(() => {
          this.router.navigate(['/my-account/manager-profile'], { skipLocationChange: false });
        }, 1000);
      });
    }, 0);
  }

  pageResetPassword() {
    this.activeRouter.activeLoading()
    setTimeout(() => {
      this.router.navigateByUrl('/loading', { skipLocationChange: true }).then(() => {
        setTimeout(() => {
          this.router.navigate(['/auth/resetPassword'], { skipLocationChange: false });
        }, 1000);
      });
    }, 0);
  }


  voltarPaginaAnterior() {
    this.location.back();
  }

}

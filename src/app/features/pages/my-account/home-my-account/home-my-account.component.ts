import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { headerComponent } from "../../home/header/header.component";
import { MobileNavbarComponent } from "../../home/mobile-navbar/mobile-navbar.component";
import { MatTabsModule } from '@angular/material/tabs';
import { AuthDecodeService } from '../../../../services/AuthUser.service';
import { AuthService } from '../../../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { PageContainerComponent } from "../../../../shared/component/page-container/page-container.component";
import { loadingService } from '../../../../services/loading/loading.service';
import { isPlatformBrowser } from '@angular/common';
import { Location } from '@angular/common';

@Component({
  selector: 'app-home-my-account',
  standalone: true,
  imports: [headerComponent, MobileNavbarComponent, MatTabsModule, MatIconModule, PageContainerComponent],
  templateUrl: './home-my-account.component.html',
  styleUrls: ['./home-my-account.component.scss']
})
export class HomeMyAccountComponent implements OnInit {
  token: any;
  isVisible = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    public authDecodeUser: AuthDecodeService,
    private auth: AuthService,
    private activeRouter: loadingService,
    private location: Location,
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
    this.isVisible = window.innerWidth <= 767;
  }

  deslogar() {
    this.auth.RemoveToken()
    this.pageHome()
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
  
  pageManagerProfile(){
    this.activeRouter.activeLoading()
    setTimeout(() => {
        this.router.navigateByUrl('/loading', { skipLocationChange: true }).then(() => {
          setTimeout(() => {
            this.router.navigate(['/my-account/manager-profile'], { skipLocationChange: false });
          }, 1000);
        });
      }, 0);
  }

  pageResetPassword(){
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

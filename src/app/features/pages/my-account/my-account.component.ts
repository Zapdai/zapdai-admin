import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { PageContainerComponent } from '../../../shared/component/page-container/page-container.component';
import { Router, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthDecodeService } from '../../../services/AuthUser.service';
import { AuthService } from '../../../services/auth.service';
import { loadingService } from '../../../services/loading/loading.service';
import { isPlatformBrowser, Location } from '@angular/common';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [RouterOutlet, MatIconModule, PageContainerComponent],
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss'],
})
export class MyAccountComponent implements OnInit {
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

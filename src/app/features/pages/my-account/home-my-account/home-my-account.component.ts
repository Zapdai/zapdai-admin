import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthDecodeService } from '../../../../services/AuthUser.service';
import { AuthService } from '../../../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { PageContainerComponent } from "../../../../shared/component/page-container/page-container.component";
import { loadingService } from '../../../../services/loading/loading.service';
import { isPlatformBrowser } from '@angular/common';
import { Location } from '@angular/common';
import { MobileNavbarComponent } from '../../../../shared/component/mobile-navbar/mobile-navbar.component';

@Component({
  selector: 'app-home-my-account',
  standalone: true,
  imports: [ MobileNavbarComponent, MatTabsModule, MatIconModule, RouterLink ],
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
          this.router.navigate(['/'])
        }, 1000);
      })

    }, 0);
  }
  
  itens = [
    {
      title: "Minhas Compras",
      icon: "shopping_bag",
      router: "../minhas-compras"
    },
    {
      title: "Lojas Próximas",
      icon: "storefront",
      router: ""
    },
    {
      title: "Metódos de Pagamento",
      icon: "payments",
      router: ""
    },
    {
      title: "Meu Negócio",
      icon: "apartment",
      router: "../admin"
    },
    {
      title: "Criar Meu Negóxio",
      icon: "add_business",
      router: "../planos"
    },
    {
      title: "Configuraões Da conta",
      icon: "manage_accounts",
      router: "manager-profile"
    },
    {
      title: "Suporte Técnico",
      icon: "add_business",
      router: ""
    },
  ]
}

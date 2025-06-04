import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { headerComponent } from "../../home/header/header.component";
import { MobileNavbarComponent } from "../../home/mobile-navbar/mobile-navbar.component";
import { MatTabsModule } from '@angular/material/tabs';
import { AuthDecodeService } from '../../../../services/AuthUser.service';
import { AuthService } from '../../../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { PageContainerComponent } from "../../../../shared/component/page-container/page-container.component";

@Component({
  selector: 'app-home-my-account',
  standalone: true,
  imports: [headerComponent, MobileNavbarComponent, MatTabsModule, MatIconModule, PageContainerComponent],
  templateUrl: './home-my-account.component.html',
  styleUrls: ['./home-my-account.component.scss']
})
export class HomeMyAccountComponent implements OnInit {
  token: any;

  constructor(
    private router: Router,
    public authDecodeUser: AuthDecodeService,
    private auth: AuthService,
  ) { }

  ngOnInit(): void {
        this.token = this.auth.returnToken();

    }
}

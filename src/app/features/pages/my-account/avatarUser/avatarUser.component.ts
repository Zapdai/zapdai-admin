import { Component, EventEmitter, HostListener, Inject, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { headerComponent } from "../../home/header/header.component";
import { MobileNavbarComponent } from "../../home/mobile-navbar/mobile-navbar.component";
import { MatTabsModule } from '@angular/material/tabs';
import { AuthDecodeService } from '../../../../services/AuthUser.service';
import { AuthService } from '../../../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { loadingService } from '../../../../services/loading/loading.service';
import { isPlatformBrowser } from '@angular/common';
import { Location } from '@angular/common';
import { avatarUserService } from '../../../../services/routesApiZapdai/avatarUser.service copy';
import { SnackService } from '../../../../services/snackBar/snack.service';

@Component({
  selector: 'app-avatarUser',
  standalone: true,
  imports: [MatTabsModule, MatIconModule],
  templateUrl: './avatarUser.component.html',
  styleUrls: ['./avatarUser.component.scss']
})
export class AvatarUserComponent implements OnInit {
  @Output() fecharModal = new EventEmitter<void>();
  token: any;
  isVisible = false;
  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;


  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    public authDecodeUser: AuthDecodeService,
    private auth: AuthService,
    private avatarUserService: avatarUserService,
    private snack: SnackService,
  ) { }

  ngOnInit(): void {
    this.token = this.auth.returnToken();

    this.authDecodeUser.retornUser().subscribe(user => {
      if (user?.avatar) {
        this.previewUrl = user.avatar;
      }
    });


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

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result || null;
      };

      reader.readAsDataURL(this.selectedFile);
    }
  }

  salvarImagem(): void {
    if (!this.selectedFile) return;

    this.enviarImagem();
    console.log('Pronto para envio:', this.selectedFile);
  }


  enviarImagem() {
    if (this.selectedFile) {
      const id = this.authDecodeUser.getusuarioId();
      this.avatarUserService.UpdateAvatarUser(id, this.selectedFile)
        .subscribe({
          next: (res) => {
            const avatarBaseUrl = `https://api.zapdai.com/zapdai/v1/usuario/avatar/${encodeURIComponent(this.authDecodeUser.getName())}.png`;
            const novaUrl = `${avatarBaseUrl}?t=${Date.now()}`;

            this.previewUrl = novaUrl;
            this.authDecodeUser.atualizaAvatar(novaUrl);

            this.snack.success(res.msg)
            this.fechar();
          }
        });


    }
  }


  fechar() {
    this.fecharModal.emit();
  }

}

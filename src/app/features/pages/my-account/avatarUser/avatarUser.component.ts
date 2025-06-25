import { Component, ElementRef, EventEmitter, HostListener, Inject, OnInit, Output, PLATFORM_ID, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthDecodeService } from '../../../../services/AuthUser.service';
import { AuthService } from '../../../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { loadingService } from '../../../../services/loading/loading.service';
import { isPlatformBrowser } from '@angular/common';
import { Location } from '@angular/common';
import { avatarUserService } from '../../../../services/routesApiZapdai/avatarUser.service';
import { SnackService } from '../../../../services/snackBar/snack.service';
import { apiAuthService } from '../../../../services/apiAuth.service';
import { Usuario } from '../../../../shared/core/types/usuario';

@Component({
  selector: 'app-avatarUser',
  standalone: true,
  imports: [MatTabsModule, MatIconModule],
  templateUrl: './avatarUser.component.html',
  styleUrls: ['./avatarUser.component.scss']
})
export class AvatarUserComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Output() fecharModal = new EventEmitter<void>();
  token: any;
  isVisible = false;
  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  usuario!: Usuario;
  valida: any;


  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    public authDecodeUser: AuthDecodeService,
    private auth: AuthService,
    private avatarUserService: avatarUserService,
    private snack: SnackService,
    private apiAuth: apiAuthService,
  ) { }

  ngOnInit(): void {
    this.token = this.auth.returnToken();

    this.authDecodeUser.retornUser().subscribe(user => {
      if (user?.avatar) {
        this.previewUrl = user.avatar;
      }
    });

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

  async onFileSelected(event: Event): Promise<void> {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const originalFile = fileInput.files[0];
      try {
        const compressedFile = await this.compressImage(originalFile, 1024, 1024, 0.8);
        this.selectedFile = compressedFile;

        const reader = new FileReader();
        reader.onload = () => {
          this.usuario.avatar = reader.result as string; // preview
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        this.snack.error('Erro ao comprimir imagem: ' + error);
        this.selectedFile = originalFile; // fallback sem compressão
      }
    }
    this.fileInput.nativeElement.value = '';
  }




  salvarImagem(): void {
    if (!this.selectedFile) return;

    this.enviarImagem();
  }


  enviarImagem() {
    this.avatarUserService.UpdateAvatarUser(this.usuario.clientId, this.selectedFile)
      .subscribe({
        next: (res) => {
          this.snack.success(res.msg);
          this.previewUrl = `${this.usuario.avatar}?t=${Date.now()}`;
          this.selectedFile = null;
          this.reloadRoute()
        },
        error: (err) => {
          this.snack.error("Erro ao atualizar avatar. " + err);
        }
      });
  }


  reloadRoute() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }


  fechar() {
    this.fecharModal.emit();
  }


  compressImage(file: File, maxWidth = 1024, maxHeight = 1024, quality = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const reader = new FileReader();

      reader.onload = e => {
        if (!e.target) return reject('Erro ao ler arquivo');
        image.src = e.target.result as string;
      };

      image.onload = () => {
        let width = image.width;
        let height = image.height;

        // Calcula proporção mantendo a proporção original
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Erro ao obter contexto do canvas');

        ctx.drawImage(image, 0, 0, width, height);

        // Converte canvas para blob (jpeg) com qualidade
        canvas.toBlob(blob => {
          if (!blob) return reject('Erro ao converter imagem para blob');
          const compressedFile = new File([blob], file.name, { type: 'image/jpeg' });
          resolve(compressedFile);
        }, 'image/jpeg', quality);
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

}

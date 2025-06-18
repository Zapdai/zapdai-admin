import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, EventEmitter, HostListener, Inject, Input, OnInit, Output, PLATFORM_ID, ViewChild } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from "@angular/router";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ChangeDetectorRef } from '@angular/core';
import { Popover } from 'primeng/popover';
import { PopoverModule } from 'primeng/popover';
import { ButtonModule } from 'primeng/button';
import { isPlatformBrowser } from '@angular/common';
import { Usuario } from "../../core/types/usuario";
import { loadingService } from "../../../services/loading/loading.service";
import { SnackService } from "../../../services/snackBar/snack.service";
import { AuthService } from "../../../services/auth.service";
import { AuthDecodeService } from "../../../services/AuthUser.service";
import { apiAuthService } from "../../../services/apiAuth.service";

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrl: "./header.component.scss",
    standalone: true,
    imports: [MatIconModule, CommonModule,
        MatIconModule, ReactiveFormsModule,
        MatMenuModule, MatSnackBarModule,
        PopoverModule, ButtonModule
    ]
})
export class headerComponent implements OnInit {
    @ViewChild('op') op!: Popover;
    @Output() ativaMenu = new EventEmitter;

    @Input() categoria?: string;
    @Input() menu = false;
    @Input() admin = false;
    @Input() carrinho = false;
    grupo = new FormGroup({
        name: new FormControl("")
    })
    ativo = true;
    isAdmin: boolean = false;
    exibimenu = false;
    isVisible = false;
    imagem: any;
    usuario!: Usuario
    @Output() emitCarrinho = new EventEmitter();
    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private router: Router,
        private activeRouter: loadingService,
        private snack: SnackService,
        public auth: AuthService,
        private cdRef: ChangeDetectorRef,
        public authDecodeUser: AuthDecodeService,
        private apiAuth: apiAuthService
    ) { }



    ngOnInit(): void {

        this.isAdmin = this.router.url.startsWith('/admin');

        // Escuta mudanças de rota subsequentes
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.isAdmin = this.router.url.startsWith('/admin');
            }
        });
        if (this.auth.PossuiToken()) {
            this.buscaUsuario();
        }


        if (isPlatformBrowser(this.platformId)) {
            this.checkWindowSize();
        }
        
    }

    toggle(event: MouseEvent) {
        this.op.toggle(event);
    }



    buscaUsuario() {
        this.apiAuth.buscaUsuario(this.authDecodeUser.getSub()).subscribe((usuario: Usuario) => {
            if (usuario !== null) {
                this.usuario = usuario;
            }
        })
    }

    setIcon(mudaIcon: boolean) {
        this.snack.openSnackBar("deu certo")
        if (mudaIcon) {
            return "keyboard_arrow_down"
        } else {
            return "chevron_right"
        }

    }

    pegarvalor() {
        const name = this.grupo.get("name")?.value;
        alert("valor digitado " + name)
    }
    light() {
       this.emitCarrinho.emit();
    }
    exibir() {
        this.ativaMenu.emit()
    }


    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        if (isPlatformBrowser(this.platformId)) {
            this.checkWindowSize();
        }
    }

    checkWindowSize() {
        if (isPlatformBrowser(this.platformId)) {
            this.isVisible = window.innerWidth > 768;
        }
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
    adminrouter() {
        this.activeRouter.activeLoading()
        setTimeout(() => {
            this.router.navigateByUrl('/loading', { skipLocationChange: true }).then(() => {
                setTimeout(() => {
                    this.router.navigate(['/admin'])
                }, 1000);
            })

        }, 0);
    }
    isAdminRoute(): boolean {
        return this.router.url === '/admin';
    }
    pageSignup() {
        this.activeRouter.activeLoading()
        setTimeout(() => {
            this.router.navigateByUrl('/loading', { skipLocationChange: true }).then(() => {
                setTimeout(() => {
                    this.router.navigate(['/auth/signup']);
                }, 1000);
            });
        }, 0);
    }

    pageSignin() {
        this.activeRouter.activeLoading()
        setTimeout(() => {
            this.router.navigateByUrl('/loading', { skipLocationChange: true }).then(() => {
                setTimeout(() => {
                    this.router.navigate(['/auth/signin'])
                }, 1000);
            })

        }, 0);
    }
    pagePlanos() {
        const role = this.authDecodeUser.getRole();

        if (role && (role.includes("ROLE_ADMIN") || role.includes("ROLE_MODERATOR"))) {
            this.activeRouter.activeLoading();
            setTimeout(() => {
                this.router.navigateByUrl('/loading', { skipLocationChange: true }).then(() => {
                    setTimeout(() => {
                        this.router.navigate(['/admin']);
                    }, 1000);
                });
            }, 0);
        } else {
            this.activeRouter.activeLoading();
            setTimeout(() => {
                this.router.navigateByUrl('/loading', { skipLocationChange: true }).then(() => {
                    setTimeout(() => {
                        this.router.navigate(['/planos']);
                    }, 1000);
                });
            }, 0);
        }
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


    Tmenu() {
        this.exibimenu = !this.exibimenu;
    }
}
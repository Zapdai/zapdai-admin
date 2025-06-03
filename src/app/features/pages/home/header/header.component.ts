import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from "@angular/router";
import { loadingService } from "../../../../services/loading/loading.service";
import { SnackService } from "../../../../services/snackBar/snack.service";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmPagamentoSocketComponent } from "../../../../services/pagamentosService/pagamentos.service";
import { ChangeDetectorRef } from '@angular/core';
import { Popover } from 'primeng/popover';
import { PopoverModule } from 'primeng/popover';
import { ButtonModule } from 'primeng/button';
import { AuthDecodeService } from "../../../../services/AuthUser.service";
import { AuthService } from "../../../../services/auth.service";

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
    token: any;
    @Input() admin = false;
    @Input() carrinho = false;
    grupo = new FormGroup({
        name: new FormControl("")
    })
    ativo = true;
    isHome: boolean = false;
    exibimenu = false;
    constructor(
        private router: Router,
        private activeRouter: loadingService,
        private snack: SnackService,
        private socket: ConfirmPagamentoSocketComponent,
        private auth: AuthService,
        private cdRef: ChangeDetectorRef,
        public authDecodeUser: AuthDecodeService,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {

        // this.emailUser = this.authService.getFromToken('sub')!;
        this.isHome = this.router.url === '/home';

        // Escuta mudanças de rota subsequentes
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.isHome = this.router.url === '/home';
            }
        });

        this.token = this.auth.returnToken();
    }

    toggle(event: MouseEvent) {
        this.op.toggle(event);
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
        alert("Clicou")
    }
    exibir() {
        this.ativaMenu.emit()
    }

    deslogar() {
        this.auth.RemoveToken()
        this.pageSignin()
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
        this.activeRouter.activeLoading()
        setTimeout(() => {
            this.router.navigateByUrl('/loading', { skipLocationChange: true }).then(() => {
                setTimeout(() => {
                    this.router.navigate(['/planos'])
                }, 1000);
            })

        }, 0);
    }

    Tmenu() {
        this.exibimenu = !this.exibimenu;
    }
}
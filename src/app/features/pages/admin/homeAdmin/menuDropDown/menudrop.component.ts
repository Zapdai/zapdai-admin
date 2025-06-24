import { CommonModule, isPlatformBrowser } from "@angular/common";
import { Component, EventEmitter, HostListener, Inject, Input, OnInit, Output, PLATFORM_ID } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { funcoes, functionList } from "../../../../../shared/core/functionList/functionList";
import { functionListService } from "../../../../../services/routesApiZapdai/functionList.service";

@Component({
    selector: "app-menu-dropdown",
    templateUrl: "./menudrop.component.html",
    styleUrl: "./menudrop.component.scss",
    standalone: true,
    imports: [MatIconModule, RouterLink, RouterLinkActive, CommonModule]
})
export class menuDropComponent implements OnInit {
    @Output() sm = new EventEmitter<void>();
    @Input() funcoes?: funcoes[];
    @Input() desabled?: boolean;  // manter 'desabled' para consistência com seu código
    functionList?: functionList;
    dropOpen: boolean = true;
    @Input() rotaAtiva?: boolean;
    isVisible = false;

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private router: Router, private functionService: functionListService) { }

    ngOnInit() {
        this.functionService.BuscarFunctionList().subscribe({
            next: (data) => {
                this.functionList = data;

                this.functionList.funcoes.forEach(f => {
                    if (!f.children) {
                        f.children = [];
                    }
                    f.ativo = false;
                });

            },
            error: (err) => console.error(err),
        });

        
        if (isPlatformBrowser(this.platformId)) {
            this.checkWindowSize();
        }
        
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

    setAtivo(id: any) {
        const itens = this.functionList?.funcoes;
        this.dropOpen = true
        if (!itens) return;

        for (const item of itens) {
            if (item.id === id) {
                // Toggle do clicado
                item.ativo = !item.ativo;
            }
        }
    }

    handleItemClick(item: any) {
        this.setAtivo(item.id);

        if (!item.children || item.children.length === 0 && !this.isVisible) {
            this.desabled = false;
        }
    }




    setIcon(mudaIcon: boolean): string {
        return mudaIcon ? "chevron_right" : "keyboard_arrow_down";
    }

    navigation(rotas: string) {
        this.router.navigateByUrl(rotas);
    }

    desabledMenu() {
        this.desabled = !this.desabled;
    }

}
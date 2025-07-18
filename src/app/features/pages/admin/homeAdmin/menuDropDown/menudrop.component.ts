import { CommonModule, isPlatformBrowser } from "@angular/common";
import { Component, EventEmitter, HostListener, Inject, Input, OnInit, Output, PLATFORM_ID } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { funcoes, functionList } from "../../../../../shared/core/functionList/functionList";
import { functionListService } from "../../../../../services/routesApiZapdai/functionList.service";
import { firstValueFrom } from "rxjs";

@Component({
    selector: "app-menu-dropdown",
    templateUrl: "./menudrop.component.html",
    styleUrl: "./menudrop.component.scss",
    standalone: true,
    imports: [MatIconModule, RouterLink, RouterLinkActive, CommonModule]
})
export class menuDropComponent {
    @Output() sm = new EventEmitter<void>();
    @Input() funcoes?: funcoes[];
    @Input() desabled?: boolean;  // manter 'desabled' para consistência com seu código
    functionList?: functionList;
    dropOpen: boolean = true;
    @Input() rotaAtiva?: boolean;
    isVisible = false;

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private router: Router, private functionService: functionListService) {
        this.buscaItens()

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
    async buscaItens() {
        const itens = sessionStorage.getItem("provider") as any;
        if(itens!=null){
            const fun = JSON.parse(itens)
            this.functionList = fun;
            this.functionList?.funcoes.forEach(f => {
                if (!f.children) {
                    f.children = [];
                }
                f.ativo = false;
            });
        }else{
        const resposta = await firstValueFrom(this.functionService.BuscarFunctionList());
        if (resposta) {
            const json = JSON.stringify(resposta)
           sessionStorage.setItem("provider",json);
           this.functionList = resposta; 
           this.functionList?.funcoes.forEach(f => {
                if (!f.children) {
                    f.children = [];
                }
                f.ativo = false;
            }); 
        }
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
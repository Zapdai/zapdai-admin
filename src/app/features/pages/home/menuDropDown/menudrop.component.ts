import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { functionList, funcoes } from "../../../../shared/core/functionList/functionList";
import { functionListService } from "../../../../services/routesApiZapdai/functionList.service";

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
    @Input() rotaAtiva?:boolean;

    constructor(private router: Router, private functionService: functionListService) { }

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




    setIcon(mudaIcon: boolean): string {
        return mudaIcon ? "chevron_right" : "keyboard_arrow_down";
    }

    navigation(rotas: string) {
        this.router.navigateByUrl(rotas);
    }

    btn() {
        this.desabled = !this.desabled;
    }

}
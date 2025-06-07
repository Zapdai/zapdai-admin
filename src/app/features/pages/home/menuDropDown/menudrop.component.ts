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

    constructor(private router: Router, private functionService: functionListService) { }

    ngOnInit() {
        this.functionService.BuscarFunctionList().subscribe({
            next: (data) => {
                this.functionList = data;

                // Normaliza todos os children para evitar undefined
                this.functionList.funcoes.forEach(f => {
                    if (!f.children) {
                        f.children = [];
                    }
                });

                console.log(this.functionList);
            },
            error: (err) => console.error(err),
        });
    }


    setAtivo(id: string) {
        const itens = this.functionList?.funcoes;
        if (!itens) return;

        for (const item of itens) {
            if (item.id === id) {
                item.ativo = !item.ativo;
                break;
            }
        }
    }

    setIcon(mudaIcon: boolean): string {
        return mudaIcon ? "keyboard_arrow_down" : "chevron_right";
    }

    navigation(rotas: string) {
        this.router.navigateByUrl(rotas);
    }

    btn() {
        this.desabled = !this.desabled;
    }

}
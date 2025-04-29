import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";

@Component({
    selector:"app-menu-dropdown",
    templateUrl:"./menudrop.component.html",
    styleUrl:"./menudrop.component.scss",
    standalone:true,
    imports:[MatIconModule, RouterLink, RouterLinkActive,CommonModule,MatIconModule]
})
export class menuDropComponent{
     @Output() sm = new EventEmitter;
    menuIten = [
        {
            id: 0,
            name: "Home",
            icone: "home",
            rotas: "/home",
            menuItens: false,
            iconeItem: false,
            children: []
        },
        {
            id: 1,
            name: "Dashboard",
            icone: "bar_chart_4_bars",
            rotas: "/home/dashboard",
            menuItens: false,
            iconeItem: false,
            children: []
        },
        {
            id: 2,
            name: "Clientes",
            icone: "groups",
            rotas: "/home/clientes",
            menuItens: false,
            iconeItem: false,
            children: []
        },

        {
            id: 3,
            name: "Produtos",
            icone: "menu_book",
            rotas: "/home/produtos",
            menuItens: false,
            iconeItem: false,
            children: []
        },
        {
            id: 4,
            name: "Cadastro",
            icone: "assignment_ind",
            menuItens: false,
            iconeItem: true,
            children: [
                {
                    name: "Contas a Pagar",
                },
                {
                    name: "Contas a Pagar"
                },
                {
                    name: "Boletos"
                },
                {
                    name: "Contas a Pagar"
                },
                {
                    name: "Contas a Pagar"
                },
                {
                    name: "Boletos"
                },
                {
                    name: "Contas a Pagar"
                },
                {
                    name: "Contas a Pagar"
                },
                {
                    name: "Boletos"
                }


            ]
        },
        {
            id: 5,
            name: "Financeiro",
            icone: "attach_money",
            menuItens: false,
            iconeItem: true,
            children: [
                {
                    name: "Contas a Pagar",
                    rota: "/dashboard/contas/pagar"
                },
                {
                    name: "Contas a Receber",
                    rota: "/dashboard/contas/receber"
                },
                {
                    name: "Boletos",
                    rota: "/dashboard/contas/boletos"
                }


            ]
        },
        {
            id: 6,
            name: "Planos",
            icone: "new_releases",
            menuItens: false,
            iconeItem: true,
            children: [
                {
                    name: "Todos",
                    rota: "/dashboard/planos/all"
                },
                {
                    name: "Plano Básico"
                },
                {
                    name: "Plano Intermediário"
                },
                {
                    name: "Plano Premium"
                },
                {
                    name: "Plano Personalizado"
                }


            ]
        },
        {
            id: 7,
            name: "Tarefas",
            icone: "today",
            rotas: "/dashboard/tarefas",
            menuItens: false,
            iconeItem: false,
            children: []
        },
        {
            id: 8,
            name: "Ações",
            icone: "pending_actions",
            rotas: "/dashboard/acoes",
            menuItens: false,
            iconeItem: false,
            children: []
        },
        {
            id: 9,
            name: "Anotaçoes",
            icone: "assignment",
            rotas: "/dashboard/anotacoes",
            menuItens: false,
            iconeItem: false,
            children: []
        },
        {
            id: 10,
            name: "Pedidos",
            icone: "shopping_cart",
            rotas: "/dashboard/anotacoes",
            menuItens: false,
            iconeItem: false,
            children: []
        },
        {
            id: 11,
            name: "Entregadores",
            icone: "local_shipping",
            rotas: "/dashboard/anotacoes",
            menuItens: false,
            iconeItem: false,
            children: []
        }
    ]
    @Input() desabled?: boolean;
    constructor(private router: Router) { }
    setAtivo(id: number) {
        const itens = this.menuIten.find((item) => item.id === id
        )
        if (itens && itens.menuItens) {
            itens.menuItens = !itens.menuItens
        } else {
            itens!.menuItens = true
        }
    }
    setIcon(mudaIcon: boolean) {
        if (mudaIcon) {
            return "keyboard_arrow_down"
        } else {
            return "chevron_right"
        }

    }


    selectedIndex: number | null = null;

    selectItem(index: number): void {
        this.selectedIndex = this.selectedIndex === index ? null : index;
    }
    navigation(rotas: any) {
        this.router.navigateByUrl(rotas, { skipLocationChange: false }).then((e) => {

            location.reload();



        });
    }
    btn(){
        this.desabled = !this.desabled;
    }
}
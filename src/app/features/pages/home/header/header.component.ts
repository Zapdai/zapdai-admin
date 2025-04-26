import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {MatIconModule} from '@angular/material/icon';
import { RouterLink } from "@angular/router";
@Component({
    selector:"app-header",
    templateUrl:"./header.component.html",
    styleUrl:"./header.component.scss",
    standalone:true,
    imports:[MatIconModule,CommonModule,RouterLink]
})
export class headerComponent{
    setIcon(mudaIcon: boolean) {
        if (mudaIcon) {
            return "keyboard_arrow_down"
        } else {
            return "chevron_right"
        }

    }

    menuIten = [
        {
            id: 1,
            name: "Home",
            icone: "",
            rotas: "/dashboard/painel",
            menuItens: false,
            iconeItem: false,
            children: []
        },
        {
            id: 2,
            name: "Planos",
            icone: "",
            rotas: "/dashboard/cadastro",
            menuItens: false,
            iconeItem: false,
            children: []
        },

        {
            id: 3,
            name: "API",
            icone: "",
            rotas: "/dashboard/agendamentos",
            menuItens: false,
            iconeItem: false,
            children: []
        },
        {
            id: 4,
            name: "Integraçao",
            icone: "keyboard_arrow_down",
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
                }

            ]
        },
        {
            id: 5,
            name: "Configuraçao",
            icone: " keyboard_arrow_down",
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
        }
    ]
}
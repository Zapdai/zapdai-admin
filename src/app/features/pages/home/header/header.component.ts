import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { Router } from "@angular/router";
import { loadingService } from "../../../../services/loading/loading.service";
import { SnackService } from "../../../../services/snackBar/snack.service";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmPagamentoSocketComponent } from "../../../../services/pagamentosService/pagamentos.service";


@Component({
    selector:"app-header",
    templateUrl:"./header.component.html",
    styleUrl:"./header.component.scss",
    standalone:true,
    imports:[MatIconModule
        ,CommonModule,
        MatIconModule,ReactiveFormsModule,MatMenuModule,MatSnackBarModule,
    ]
})
export class headerComponent{
    @Input() categoria?:string;
    @Input() usuario = false;
    @Input() carrinho = false;
    grupo = new FormGroup({
        name:new FormControl("")
    })
    ativo = false;
    @Output() ativaMenu = new EventEmitter;
    constructor(private router:Router,private activeRouter:loadingService,private snack:SnackService,private socket:ConfirmPagamentoSocketComponent){}
    setIcon(mudaIcon: boolean) {
        this.snack.openSnackBar("deu certo")
        if (mudaIcon) {
            return "keyboard_arrow_down"
        } else {
            return "chevron_right"
        }

    }
    pegarvalor(){
       const name = this.grupo.get("name")?.value;
       alert("valor digitado "+name)
    }
    light(){
        alert("Clicou")
    }
exibir(){
    this.ativaMenu.emit()
}

pageHome(){
    this.activeRouter.activeLoading()
    setTimeout(() => {
        this.router.navigateByUrl('/loading', { skipLocationChange: true}).then(()=>{
            setTimeout(() => {
                this.router.navigate(['/home'])
            }, 1000);
        })
        
    }, 0);
}
pageSignup(){
    this.activeRouter.activeLoading()
    setTimeout(() => {
        this.router.navigateByUrl('/loading', { skipLocationChange: true }).then(() => {
          setTimeout(() => {
            this.router.navigate(['/auth/signup']);
          }, 1000);
        });
      }, 0);
}

pageSignin(){
    this.activeRouter.activeLoading()
    setTimeout(() => {
        this.router.navigateByUrl('/loading', { skipLocationChange: true}).then(()=>{
            setTimeout(() => {
                this.router.navigate(['/auth/signin'])
            }, 1000);
        })
        
    }, 0);
}
pagePlanos(){
    this.activeRouter.activeLoading()
    setTimeout(() => {
        this.router.navigateByUrl('/loading', { skipLocationChange: true}).then(()=>{
            setTimeout(() => {
                this.router.navigate(['/planos'])
            }, 1000);
        })
        
    }, 0);
}
}
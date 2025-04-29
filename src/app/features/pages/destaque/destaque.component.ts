import { Component, ElementRef, ViewChild } from "@angular/core";
import { ModalComponent } from "../../../shared/component/modal/modal.component";
import { UtiusComponent } from "../../../shared/component/utius/utius.component";
import { CarrosselComponent } from "../../../shared/component/carrossel/carrossel.component";

@Component({
    selector:"app-destaque",
    standalone:true,
    imports:[ModalComponent,UtiusComponent,CarrosselComponent],
    templateUrl:"./destaque.component.html",
    styleUrl:"./destaque.component.scss"
})
export class DestaqueComponent{
    @ViewChild("scrollContainer",{static:false}) fer?:ElementRef;
rolarDireita(){
    this.fer?.nativeElement.scrollBy({
        left:-200,
        behavior: 'smooth'
    })
}
rolarEsquerda(){
    this.fer?.nativeElement.scrollBy({
        left:200,
        behavior: 'smooth'
    })
}
imagem = ""
}
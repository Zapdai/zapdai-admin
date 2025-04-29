import { Component, ElementRef, ViewChild } from "@angular/core";
import { ModalComponent } from "../../../shared/component/modal/modal.component";
import { UtiusComponent } from "../../../shared/component/utius/utius.component";

@Component({
    selector:"",
    standalone:true,
    imports:[ModalComponent,UtiusComponent],
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
imagem = "https://img.freepik.com/fotos-premium/hamburguer-em-fundo-de-madeira-alimentos-pouco-saudaveis-feito-por-iainteligencia-artificial_41969-12355.jpg"
}
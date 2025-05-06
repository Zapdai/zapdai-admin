import { Component, EventEmitter, Output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector:"app-aside-modal",
    standalone:true,
    imports:[MatIconModule],
    templateUrl:"aside-modal.component.html",
    styleUrl:"aside-modal.component.scss"
})
export class AsideComponent{
@Output() emitModal = new EventEmitter()
 ativaModal(){
    this.emitModal.emit();
 }
 ativaModal2(event:any){
    this.emitModal.emit();
 }
 pararPropagacao(event: Event) {
    event.stopPropagation(); 
  }
}
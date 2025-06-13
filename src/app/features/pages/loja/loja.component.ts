import { Component } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-loja',
 imports: [ MatTabsModule],
  templateUrl: './loja.component.html',
  styleUrl: './loja.component.scss'
})
export class AppLojaComponent{
    nome:any;
 constructor(public route:ActivatedRoute){
    this.nome =      this.route.snapshot.paramMap.get("nome") as any

 }

 

}
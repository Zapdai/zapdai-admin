import { Component } from '@angular/core';
import {MatListModule} from '@angular/material/list';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-planos',
  imports: [RouterOutlet, MatListModule, RouterOutlet],
  templateUrl: './planos.component.html',
  styleUrl: './planos.component.scss'
})
export class PlanosComponent {  
  constructor (private router: Router){}
  img = "/banners/banner-planos.png"
  ativ = false;

  ativaModal(){
    this.ativ = !this.ativ;
  }
  
  pageCheckout(){
    this.router.navigateByUrl('/planos/checkout', { skipLocationChange: false })
  }

}

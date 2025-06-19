import { Component, EventEmitter, Input, input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-utius',
  imports: [MatButtonModule, CommonModule],
  templateUrl: './utius.component.html',
  styleUrl: './utius.component.scss'
})
export class UtiusComponent implements OnInit {
  @Input() id?: number;
  @Input() imagem?: string;
  @Output() emiter = new EventEmitter();
  @Input() titulo?: string;
  @Input() price?: number;
  nome: any
  isAdmin: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.isAdmin = this.router.url.startsWith('/admin');

    // Escuta mudanças de rota subsequentes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isAdmin = this.router.url.startsWith('/admin');
      }
    });
  }
  detalhes() {
    this.emiter.emit()
  }

}

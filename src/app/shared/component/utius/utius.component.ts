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
export class UtiusComponent {
  @Input() id?: number;
  @Input() imagem?: string;
  @Output() emiter = new EventEmitter();
  @Input() titulo?: string;
  @Input() price?: number;
  nome: any

  constructor(private router: Router) { }
  detalhes() {
    this.emiter.emit()
  }

}

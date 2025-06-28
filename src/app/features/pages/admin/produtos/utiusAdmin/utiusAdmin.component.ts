import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-utiusAdmin',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './utiusAdmin.component.html',
  styleUrl: './utiusAdmin.component.scss'
})
export class UtiusAdminComponent implements OnInit {
  @Input() id?: number;
  @Input() imagem?: string;
  @Input() titulo?: string;
  @Input() price?: number;
  @Output() emiter = new EventEmitter();
  @Output() editarProdutoEmit = new EventEmitter<number>();

  isAdmin = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.verificarAdmin(this.router.url);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.verificarAdmin(event.urlAfterRedirects);
      }
    });
  }

  verificarAdmin(url: string) {
    this.isAdmin = url.startsWith('/admin');
  }

  detalhes() {
    this.emiter.emit();
  }

  editar(id?: number, trigger?: MatMenuTrigger) {
    if (id) this.editarProdutoEmit.emit(id);
    trigger?.closeMenu(); // fecha o menu após ação
  }

  deletar(id?: number, trigger?: MatMenuTrigger) {
    alert('Deletar: ' + id);
    trigger?.closeMenu(); // fecha o menu após ação
  }
}

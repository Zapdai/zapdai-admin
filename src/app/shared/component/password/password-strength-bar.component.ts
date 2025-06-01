import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-password-strength-bar',
  templateUrl: './password-strength-bar.component.html',
  styleUrls: ['./password-strength-bar.component.scss']
})
export class PasswordStrengthBarComponent implements OnChanges {
  @Input() senha: any

  barraLargura: string = '0%';
  textoNivel: string = '';
  corNivel: string = '#ccc';

  ngOnChanges() {
    if (this.senha !== undefined && this.senha !== null) {
      this.atualizarBarra();
    }
  }

  atualizarBarra() {
    const senha = this.senha || '';  // Protege contra null
    const pontos = this.calcularForca(senha);

    const numMaiusculas = (senha.match(/[A-Z]/g) || []).length;
    const numNumeros = (senha.match(/[0-9]/g) || []).length;
    const numSimbolos = (senha.match(/[^a-zA-Z0-9]/g) || []).length;

    const requisitosFortes = numMaiusculas >= 1 && numNumeros >= 1 && numSimbolos >= 1;
    const requisitosMuitoFortes = numMaiusculas >= 2 && numNumeros >= 2 && numSimbolos >= 2;

    switch (pontos) {
      case 0:
      case 1:
        this.definirBarra('10%', 'Muito Fraca', '#d63031');
        break;
      case 2:
        this.definirBarra('25%', 'Fraca', '#e17055');
        break;
      case 3:
        this.definirBarra('40%', 'Média', '#f39c12');
        break;
      case 4:
        this.definirBarra('60%', 'Boa', '#f1c40f');
        break;
      case 5:
        if (requisitosMuitoFortes) {
          this.definirBarra('100%', 'Muito Forte', '#2ecc71');
        } else if (requisitosFortes) {
          this.definirBarra('80%', 'Forte', '#27ae60');
        } else {
          this.definirBarra('60%', 'Boa', '#f1c40f');
        }
        break;
      case 6:
      default:
        if (requisitosMuitoFortes) {
          this.definirBarra('100%', 'Muito Forte', '#2ecc71');
        } else if (requisitosFortes) {
          this.definirBarra('80%', 'Forte', '#27ae60');
        } else {
          this.definirBarra('60%', 'Boa', '#f1c40f');
        }
        break;
    }
  }


  definirBarra(largura: string, texto: string, cor: string) {
    this.barraLargura = largura;
    this.textoNivel = texto;
    this.corNivel = cor;
  }

  calcularForca(s: string): number {
    let pontos = 0;
    if (s.length >= 8) pontos++; // mínimo agora é 8
    if (s.length >= 10) pontos++;
    if (/[a-z]/.test(s)) pontos++;
    if (/[A-Z]/.test(s)) pontos++;
    if (/[0-9]/.test(s)) pontos++;
    if (/[^a-zA-Z0-9]/.test(s)) pontos++;
    return pontos;
  }

}

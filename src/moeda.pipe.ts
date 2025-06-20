import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moedaBRL',
  standalone: true
})
export class MoedaPipe implements PipeTransform {
  transform(value: number | string): string {
    if (!value) return 'R$ 0,00';
    let val = Number(value);
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}

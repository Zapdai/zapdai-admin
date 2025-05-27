import { AbstractControl, ValidationErrors } from '@angular/forms';

// validators.ts
export function validarCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpf[10]);
}

export function validarCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/[^\d]+/g, '');
  if (cnpj.length !== 14) return false;

  if (/^(\d)\1+$/.test(cnpj)) return false;

  let t = cnpj.length - 2;
  let d = cnpj.substring(t);
  let d1 = parseInt(d.charAt(0));
  let d2 = parseInt(d.charAt(1));
  let calc = (x: number) => {
    let n = cnpj.substring(0, x);
    let y = x - 7;
    let s = 0;
    let r = 0;

    for (let i = x; i >= 1; i--) {
      s += parseInt(n.charAt(x - i)) * y--;
      if (y < 2) y = 9;
    }
    r = 11 - (s % 11);
    return r > 9 ? 0 : r;
  };

  return calc(t) === d1 && calc(t + 1) === d2;
}

export function validarNumeroCartao(numero: string): boolean {
  const sanitized = numero.replace(/\D/g, '');
  let sum = 0;
  let shouldDouble = false;

  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized.charAt(i));
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}


export function cpfOuCnpjValidator(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;
  if (!valor) return null;

  const somenteNumeros = valor.replace(/\D/g, '');
  if (somenteNumeros.length === 11 && !validarCPF(somenteNumeros)) {
    return { cpfInvalido: true };
  }

  if (somenteNumeros.length === 14 && !validarCNPJ(somenteNumeros)) {
    return { cnpjInvalido: true };
  }

  return null;
}

export function cartaoValidator(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;
  if (!valor) return null;

  if (!validarNumeroCartao(valor)) {
    return { cartaoInvalido: true };
  }

  return null;
}


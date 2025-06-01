import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

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

export function validarEmail(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const isValid = emailRegex.test(value);
    return isValid ? null : { emailInvalido: true };
}


export function cartaoValidator(control: AbstractControl): ValidationErrors | null {
    const valor = control.value;
    if (!valor) return null;

    if (!validarNumeroCartao(valor)) {
        return { cartaoInvalido: true };
    }

    return null;
}


export function validarCep(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) return null;

    // Remove tudo que não for número
    const cep = value.replace(/\D/g, '');

    // Verifica se tem 8 dígitos e não é repetido (ex: 00000000)
    const cepValido = /^[0-9]{8}$/.test(cep) && !/^(\d)\1+$/.test(cep);

    return cepValido ? null : { cepInvalido: true };
}



export function senhaValidator(control: AbstractControl): ValidationErrors | null {
    const senha: string = control.value || '';

    if (!senha) return null;

    // Regras para ser considerada forte:
    // mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 símbolo
    const minLength = 8;
    const maiusculas = (senha.match(/[A-Z]/g) || []).length;
    const minusculas = (senha.match(/[a-z]/g) || []).length;
    const numeros = (senha.match(/[0-9]/g) || []).length;
    const simbolos = (senha.match(/[^a-zA-Z0-9]/g) || []).length;

    const erros: ValidationErrors = {};

    if (senha.length < minLength) {
        erros['minLength'] = { requiredLength: minLength, actualLength: senha.length };
    }
    if (maiusculas < 1) {
        erros['minUppercase'] = { required: 1, actual: maiusculas };
    }
    if (minusculas < 1) {
        erros['minLowercase'] = { required: 1, actual: minusculas };
    }
    if (numeros < 1) {
        erros['minNumbers'] = { required: 1, actual: numeros };
    }
    if (simbolos < 1) {
        erros['minSymbols'] = { required: 1, actual: simbolos };
    }

    return Object.keys(erros).length > 0 ? erros : null;
}

export const senhaIguaisValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const senha = group.get('password')?.value;
    const repetirSenha = group.get('repeatPassword')?.value;

    if (!senha || !repetirSenha) return null;

    return senha === repetirSenha ? null : { senhasDiferentes: true };
};

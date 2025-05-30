import { Component, EventEmitter, Output, ViewChildren, QueryList, ElementRef, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
    selector: 'app-inputOPT',
    templateUrl: './inputOPT.component.html',
    styleUrls: ['./inputOPT.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule]
})
export class inputOPTComponent {
    codigo: string[] = ['', '', '', '', '', ''];

    @Output() codigoCompleto = new EventEmitter<string>();

    autoTab(index: number, event: any) {
        const input = event.target;
        const value = input.value;
        this.codigo[index] = value;

        // Passa para o próximo input automaticamente
        if (value && index < this.codigo.length - 1) {
            const nextInput = input.nextElementSibling;
            if (nextInput) {
                nextInput.focus();
            }
        }

        // Se o código estiver completo, emite para o pai
        if (this.codigo.every(char => char.length === 1)) {
            this.codigoCompleto.emit(this.codigo.join(''));
        }
    }

}

import {
  Component,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  Input
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SnackService } from '../../../../../services/snackBar/snack.service';
import { CommonModule } from '@angular/common';

type DomFile = globalThis.File;

@Component({
  selector: 'app-image-drop-carrossel02',
  standalone: true,
  templateUrl: './image-drop-carrossel.component.html',
  styleUrls: ['./image-drop-carrossel.component.scss'],
  imports: [MatIconModule, CommonModule]
})
export class ImageDropCarrossel02Component {
  MAX_IMAGENS = 3;
  @Input() images: { url: string; file?: File }[] = [];



  @Output() enviarImagens = new EventEmitter<File[]>();
  @ViewChild('scrollContainer', { static: false }) fer?: ElementRef;

  constructor(private snack: SnackService) { }

  gerar7DigitosNumericos() {
    return Math.floor(1000000 + Math.random() * 9000000).toString();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      this.handleFiles(event.dataTransfer.files);
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(input.files);
    }
  }

  async handleFiles(files: FileList) {
    const MAX_FILE_SIZE_MB = 1;
    const MAX_WIDTH = 1024;
    const MAX_HEIGHT = 1024;

    if (this.images.length >= this.MAX_IMAGENS) {
      this.snack.error('Você só pode adicionar até 3 imagens.');
      return;
    }

    const compressImage = (file: File): Promise<{ url: string; file: File }> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > MAX_WIDTH || height > MAX_HEIGHT) {
              const aspect = width / height;
              if (aspect > 1) {
                width = MAX_WIDTH;
                height = MAX_WIDTH / aspect;
              } else {
                height = MAX_HEIGHT;
                width = MAX_HEIGHT * aspect;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject('Erro ao obter contexto do canvas');

            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
              (blob) => {
                if (!blob) return reject('Erro ao gerar blob');

                const tamanhoMB = blob.size / (1024 * 1024);
                if (tamanhoMB > MAX_FILE_SIZE_MB) {
                  reject(`Imagem comprimida ainda tem ${tamanhoMB.toFixed(2)} MB`);
                } else {
                  const extensao = file.name.split('.').pop() || 'jpg';
                  const nomeAleatorio = `img_${this.gerar7DigitosNumericos()}.${extensao}`;
                  const novoArquivo = new File([blob], nomeAleatorio, {
                    type: 'image/jpeg'
                  });
                  const url = URL.createObjectURL(blob);
                  resolve({ url, file: novoArquivo });
                }
              },
              'image/jpeg',
              1
            );
          };
          img.onerror = () => reject('Erro ao carregar imagem');
          img.src = event.target?.result as string;
        };
        reader.onerror = () => reject('Erro ao ler imagem');
        reader.readAsDataURL(file);
      });
    };

    const imagens: { url: string; file: File }[] = [];
    const erros: string[] = [];

    for (const file of Array.from(files)) {
      if (this.images.length + imagens.length >= this.MAX_IMAGENS) break;
      try {
        const comprimida = await compressImage(file);
        imagens.push(comprimida);
      } catch (e: any) {
        erros.push(typeof e === 'string' ? e : `Erro com ${file.name}`);
      }
    }

    if (imagens.length > 0) {
      this.images.push(...imagens);
      this.emitirImagensParaPai();
    }

    if (erros.length > 0) {
      this.snack.error('Algumas imagens não puderam ser processadas.');
      console.error('Erros ao processar imagens:', erros);
    }
  }

  deleteImage(index: number) {
    this.images.splice(index, 1);
    this.emitirImagensParaPai();
  }

  emitirImagensParaPai() {
    const arquivos = this.images
      .map(img => img.file)
      .filter((file): file is File => file !== undefined);
    this.enviarImagens.emit(arquivos);
  }


  rolarDireita() {
    this.fer?.nativeElement.scrollBy({
      left: 272,
      behavior: 'smooth'
    });
  }

  rolarEsquerda() {
    this.fer?.nativeElement.scrollBy({
      left: -272,
      behavior: 'smooth'
    });
  }

  preventDefault(event: Event) {
    event.preventDefault();
  }
}

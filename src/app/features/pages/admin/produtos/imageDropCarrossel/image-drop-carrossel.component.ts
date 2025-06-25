import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { SnackService } from '../../../../../services/snackBar/snack.service';

type DomFile = globalThis.File;

@Component({
  selector: 'app-image-drop-carrossel',
  standalone: true,
  templateUrl: './image-drop-carrossel.component.html',
  styleUrls: ['./image-drop-carrossel.component.scss'],
  imports: [MatIconModule]
})
export class ImageDropCarrosselComponent implements OnInit, OnDestroy {
  currentIndex = 0;
  images: { url: string; file: DomFile }[] = [];

  @Output() enviarImagens = new EventEmitter<File[]>();

  private touchStartX = 0;
  private mouseStartX = 0;
  private isMouseDown = false;

  constructor(
    private snack: SnackService,
  ) { }

  ngOnInit() {
    document.addEventListener('mouseup', this.globalMouseUp.bind(this));
  }

  ngOnDestroy() {
    document.removeEventListener('mouseup', this.globalMouseUp.bind(this));
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

  gerar7DigitosNumericos() {
    return Math.floor(1000000 + Math.random() * 9000000).toString();
  }

  async handleFiles(files: FileList) {
    const MAX_FILE_SIZE_MB = 1;  // limite máximo de MB

    const MAX_WIDTH = 1024;
    const MAX_HEIGHT = 1024;

    const compressImage = (file: File): Promise<{ url: string, file: File }> => {
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
            if (!ctx) return reject("Erro ao obter contexto do canvas");

            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(blob => {
              if (!blob) return reject("Erro ao gerar blob");

              const tamanhoMB = blob.size / (1024 * 1024);

              if (tamanhoMB > MAX_FILE_SIZE_MB) {
                reject(`Imagem comprimida ainda tem ${tamanhoMB.toFixed(2)} MB, que ultrapassa o limite de ${MAX_FILE_SIZE_MB} MB`);
              } else {
                const extensao = file.name.split('.').pop() || 'jpg';
                const nomeAleatorio = `img_${this.gerar7DigitosNumericos()}.${extensao}`;
                const novoArquivo = new File([blob], nomeAleatorio, { type: 'image/jpeg' });
                const url = URL.createObjectURL(blob);
                resolve({ url, file: novoArquivo });
              }
            }, 'image/jpeg', 1);
          };

          img.onerror = () => reject("Erro ao carregar imagem");
          img.src = event.target?.result as string;
        };

        reader.onerror = () => reject("Erro ao ler imagem");
        reader.readAsDataURL(file);
      });
    };

    const imagens: { url: string, file: File }[] = [];
    const erros: string[] = [];

    for (const file of Array.from(files)) {
      try {
        const comprimida = await compressImage(file);
        imagens.push(comprimida);
      } catch (e: any) {
        erros.push(typeof e === 'string' ? e : `Erro com ${file.name}`);
      }
    }

    if (imagens.length > 0) {
      this.images.push(...imagens);
      this.currentIndex = this.images.length - 1;
      this.emitirImagensParaPai();
    }

    if (erros.length > 0) {
      this.snack.error("Erros ao processar imagem");
    }
  }



  deleteImage(index: number) {
    this.images.splice(index, 1);
    if (this.currentIndex > this.images.length - 1) {
      this.currentIndex = this.images.length - 1;
    }
    if (this.images.length === 0) {
      this.currentIndex = 0;
    }
    this.emitirImagensParaPai();  // Emite para o pai aqui também
  }

  prev() {
    if (this.currentIndex > 0) this.currentIndex--;
  }

  next() {
    if (this.currentIndex < this.images.length) this.currentIndex++;
  }

  preventDefault(event: Event) {
    event.preventDefault();
  }

  // Eventos touch para swipe
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
  }

  onTouchEnd(event: TouchEvent) {
    const touchEndX = event.changedTouches[0].clientX;
    this.handleSwipe(this.touchStartX, touchEndX);
  }

  // Eventos mouse para swipe
  onMouseDown(event: MouseEvent) {
    this.mouseStartX = event.clientX;
    this.isMouseDown = true;
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isMouseDown) return;
    event.preventDefault(); // evita seleção de texto
  }

  onMouseUp(event: MouseEvent) {
    if (!this.isMouseDown) return;
    this.isMouseDown = false;

    const mouseEndX = event.clientX;
    this.handleSwipe(this.mouseStartX, mouseEndX);
  }

  private globalMouseUp = (event: MouseEvent) => {
    if (!this.isMouseDown) return;
    this.isMouseDown = false;

    const mouseEndX = event.clientX;
    this.handleSwipe(this.mouseStartX, mouseEndX);
  }

  private handleSwipe(startX: number, endX: number) {
    const diff = startX - endX;

    if (Math.abs(diff) > 40) { // Threshold mínimo para swipe
      if (diff > 0) {
        this.next();
      } else {
        this.prev();
      }
    }
  }

  emitirImagensParaPai() {
    const arquivos = this.images.map(img => img.file);
    this.enviarImagens.emit(arquivos);  // arquivos é File[]
  }
}

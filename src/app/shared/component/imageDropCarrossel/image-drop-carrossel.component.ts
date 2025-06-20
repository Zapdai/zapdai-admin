import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";

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
    const promises = Array.from(files).map(file => {
      return new Promise<{ url: string; file: File }>((resolve, reject) => {
        if (!file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = () => {
          const extensao = file.name.split('.').pop() || 'jpg';
          const numerosAleatorios = this.gerar7DigitosNumericos();
          const nomeAleatorio = `img_${numerosAleatorios}.${extensao}`;

          const novoFile = new File([file], nomeAleatorio, { type: file.type });

          resolve({ url: reader.result as string, file: novoFile });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    try {
      const imagensLidas = await Promise.all(promises);
      this.images.push(...imagensLidas);
      this.currentIndex = this.images.length - 1;
      this.emitirImagensParaPai();
    } catch (err) {
      console.error("Erro ao ler imagens", err);
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

// modal-scroll.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalScrollService {
  private modalCount = 0;

  lockScroll(): void {
    this.modalCount++;
    if (this.modalCount === 1) {
      document.body.classList.add('modal-open');
    }
  }

  unlockScroll(): void {
    this.modalCount--;
    if (this.modalCount <= 0) {
      document.body.classList.remove('modal-open');
      this.modalCount = 0;
    }
  }
}

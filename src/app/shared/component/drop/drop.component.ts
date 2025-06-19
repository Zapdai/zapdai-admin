import { Component, EventEmitter, Input, Output } from "@angular/core";

import { AsyncPipe, CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { NgxDropzoneModule } from "ngx-dropzone";
interface FileWithPreview extends File {
    dataURL?: string;
    loaded?: boolean;
    date: any;
  }
@Component({
    selector:"app-drop",
    standalone:true,
    imports:[NgxDropzoneModule,
          MatProgressBarModule, ReactiveFormsModule, MatInputModule,
          FormsModule, MatAutocompleteModule,
          MatFormFieldModule,
          CommonModule,
          MatIconModule],
    templateUrl:"./drop.component.html",
    styleUrl:"./drop.component.scss"
})
export class DropComponent{
@Input() drop: "primary"|"secundary" = "primary";
    @Output() emiter =new EventEmitter();
    constructor(){}
    loading = false;
    filis: any[] = [];
    files: File[] = [];
    onRemove(file: number) {
      const removedFile = this.filis.splice(file, 1)[0];  
        
      // Encontra o índice correspondente na lista de arquivos
      const fileIndex = this.files.indexOf(removedFile);
      if (fileIndex > -1) {
          this.files.splice(fileIndex, 1);  // Remove da lista de arquivos que será enviada ao backend
      }

      this.emiter.emit(this.files);
      
    }
    onSelect(event: any) {
        this.loading = true;
        this.emiter.emit(this.files);
        this.files.push(...event.addedFiles);
        const files: FileWithPreview[] = event.addedFiles.map((file: File) => {
          const fileWithPreview = file as FileWithPreview;
          if (fileWithPreview.type.startsWith('image/')) {
            fileWithPreview.dataURL = URL.createObjectURL(fileWithPreview);
            fileWithPreview.loaded = false;
            fileWithPreview.date = this.DateForter();
          }
          return fileWithPreview;
        });
        this.filis.push(...files);
    
      }
      onTimeLoad(index: number) {
        setTimeout(() => {
          this.filis[index].loaded = true;
        }, 2000);
      }
    // removendo imagem pelo index
      DateForter() {
        const timestamp = Date.now();
        const currentDate = new Date(timestamp);
        const optionsDate = {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        };
        const optionsTime = {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        };
        const formattedDate = currentDate.toLocaleDateString('pt-BR', optionsDate as any);
        const formattedTime = currentDate.toLocaleTimeString('pt-BR', optionsTime as any).replace(/\./g, ':');
    
        const formattedDateTime = `${formattedDate} ${formattedTime}`;
        return formattedDateTime;
      }
    
}
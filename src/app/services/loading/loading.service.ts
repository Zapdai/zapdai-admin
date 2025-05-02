import { Injectable } from "@angular/core";

@Injectable({
    providedIn:"root"
})
export class loadingService{
    private _allowed = false;

    activeLoading() {
      this._allowed = true;
    }
  
    canAccess(): boolean {
      const temp = this._allowed;
      this._allowed = false; // Reset após acesso
      return temp;
    }

}
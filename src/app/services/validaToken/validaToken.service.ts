import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AuthService } from "../auth.service";
import { jwtDecode } from "jwt-decode";

@Injectable({
    providedIn:"root"
})

export class validaToken{
    constructor(private auth:AuthService){}
    userSubject = new BehaviorSubject<any | null>(null);
    Itens(): any {
    let itens;
    this.retornUser().subscribe(e => {
      if (e && e !== null) {
        itens = e;
      }
    });
    return itens;
  }
  decode() {
    const token = this.auth.returnToken();
    const user = jwtDecode(token as any) as any;
    this.userSubject.next(user);
  }
    retornUser() {
        return this.userSubject.asObservable();
      }
}

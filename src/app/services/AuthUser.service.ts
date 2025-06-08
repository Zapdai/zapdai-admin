import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { jwtDecode } from "jwt-decode";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root"
})
export class AuthDecodeService {
  userSubject = new BehaviorSubject<any | null>(null);
  constructor(private AuthToken: AuthService) {
    ;

    if (AuthToken.PossuiToken()) {
      this.decode();
    }
  }
  decode() {
    const token = this.AuthToken.returnToken();
    if (token) {
      const user = jwtDecode(token as any) as any;
      this.userSubject.next(user);
    }
  }
  retornUser() {
    return this.userSubject.asObservable();
  }

  atualizaAvatar(novaUrl: string) {
    const usuario = this.userSubject.value;
    if (usuario) {
      usuario.avatar = novaUrl;
      this.userSubject.next(usuario);
    }
  }


  getRole() {
    const user = this.userSubject.getValue();
    return user?.roles ?? null;
  }

  getName() {
    const user = this.userSubject.getValue();
    return user?.username ?? null;
  }

  getAvatar() {
    const user = this.userSubject.getValue();
    return user?.avatar ?? null;
  }

  getSub() {
    const user = this.userSubject.getValue();
    return user?.sub ?? null;
  }

  getusuarioId() {
    const user = this.userSubject.getValue();
    return user?.usuarioId ?? null;
  }



}
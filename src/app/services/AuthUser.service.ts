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
    if (AuthToken.PossuiToken()) {
      this.decode();
    }
  }
  decode() {
    const token = this.AuthToken.returnToken();
    const user = jwtDecode(token as any) as any;
    this.userSubject.next(user);
  }
  retornUser() {
    return this.userSubject.asObservable();
  }
  getRole() {
    let role;
    this.retornUser().subscribe(e => {
      if (e && e.roles !== null) {
        role = e.roles;
      }
    });
    return role as any;
  }
  getName() {
    let name;
    this.retornUser().subscribe(e => {
      name = e.username;
    });
    return name as any;
  }
  getAvatar() {
    let avatar;
    this.retornUser().subscribe(e => {
      avatar = e.avatar;
    });
    return avatar as any;
  }
  getSub() {
    let sub;
    this.retornUser().subscribe(e => {
      sub = e.sub;
    });
    return sub as any;
  }
  getusuarioId() {
    let usuarioId;
    this.retornUser().subscribe(e => {
      usuarioId = e.usuarioId;
    });
    return usuarioId as any;
  }
}
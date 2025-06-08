import { Injectable } from "@angular/core";
import { jwtDecode } from "jwt-decode";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class AuthService {
    userSubject = new BehaviorSubject<any | null>(null);

    PossuiToken() {
        return this.returnToken() ? true : false;
    }

    returnToken() {
        if (typeof localStorage !== 'undefined') {
            return localStorage.getItem('acessToken')
        }
        return
    }

    RemoveToken() {
        localStorage.removeItem('acessToken')
    }

    saveToken(token: string) {
        localStorage.removeItem('acessToken');
        localStorage.setItem('acessToken', token);

        try {
            const user = jwtDecode(token);
            this.userSubject.next(user);
        } catch (e) {
            console.error('Token inválido');
            this.RemoveToken();
        }
    }




    decode() {
        const token = this.returnToken();
        const user = jwtDecode(token as any) as any;
        this.userSubject.next(user);
    }

    //     getPerfis(): string[] {
    //         const token = this.returnToken();
    //         if (!token) return [];

    //         try {
    //             // Decodifica o token (JWT base64)
    //             const payload = JSON.parse(atob(token.split('.')[1]));
    //             const roles = payload['roles'] || [];

    //             // Garante que retorna um array de strings
    //             return Array.isArray(roles) ? roles : [roles];
    //         } catch (e) {
    //             console.error('Erro ao decodificar o token:', e);
    //             return [];
    //         }
    //     }

    //     getFromToken(field: string): string | null {
    //     const token = this.returnToken();
    //     if (!token) return null;

    //     try {
    //         const payload = JSON.parse(atob(token.split('.')[1]));
    //         return payload[field] || null;
    //     } catch (e) {
    //         console.error('Erro ao decodificar o token:', e);
    //         return null;
    //     }
    // }



}
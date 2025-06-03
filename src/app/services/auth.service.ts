import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class AuthService {
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
        localStorage.setItem('acessToken', token)
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
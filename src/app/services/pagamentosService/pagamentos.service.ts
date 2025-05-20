import { isPlatformBrowser } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class ConfirmPagamentoSocketComponent {
    private stompClient: any;
    private pagamentoSubject = new Subject<any>();
    pagamento$ = this.pagamentoSubject.asObservable();
    private pingIntervalId: any;
    private reconectando = false;


    constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

    async socketWeb(email: string) {
        if (!isPlatformBrowser(this.platformId)) return;

        if (this.stompClient?.connected || this.stompClient?.active) return; // <-- EVITA RECONEXÃO

        const { Client } = await import('@stomp/stompjs');
        const SockJS = (await import('sockjs-client')).default;

        this.stompClient = new Client({
            webSocketFactory: () => new SockJS('https://server.zapdai.com/zapdai'),
            reconnectDelay: 1000,
            debug: () => { },
        });

        this.stompClient.onConnect = (frame: any) => {
            console.log("conectado ao WebSocket");

            this.stompClient.subscribe(`/topic/pagamentos/${email}`, (msg: any) => {
                console.log('📩 Mensagem recebida do WebSocket:', msg.body);
                const data = JSON.parse(msg.body);
                this.pagamentoSubject.next(data); // <-- dispara evento para o componente
            });

            // ✅ Envia o "ping" a cada 2s para manter o backend ativo
            this.pingIntervalId = setInterval(() => {
                console.log('📤 Enviando ping com email:', email);
                this.stompClient.publish({
                    destination: '/app/busca',
                    body: JSON.stringify({ email }),
                });
            }, 5000);

        };

        this.stompClient.onStompError = (frame: any) => {
            console.error("Erro STOMP:", frame.headers['message']);
            console.error("Detalhes:", frame.body);
        };

        this.stompClient.onWebSocketClose = () => {
            this.reconectar(email);
        };

        this.stompClient.activate();
    }

    reconectar(email: string) {
        if (this.reconectando) return;

        this.reconectando = true;

        setTimeout(() => {
            if (!this.stompClient?.connected) {
                this.stompClient.deactivate().then(() => {
                    console.log("🔌 WebSocket desconectado. Tentando reconectar...");
                    this.socketWeb(email);
                    this.reconectando = false;
                });
            }
        }, 5000);
    }


    desconectar() {
        // Limpa o ping
        if (this.pingIntervalId) {
            clearInterval(this.pingIntervalId);
            this.pingIntervalId = null;
        }

        // Desativa reconexão
        if (this.stompClient) {
            this.stompClient.reconnectDelay = 0; // impede novas tentativas
            this.stompClient.onWebSocketClose = undefined; // desativa reações
            this.stompClient.onStompError = undefined;
            this.stompClient.onConnect = undefined;

            this.stompClient.deactivate().then(() => {
                console.log('🛑 WebSocket desconectado completamente');
            });

            this.stompClient = null;
        }

        this.reconectando = false;
    }



}

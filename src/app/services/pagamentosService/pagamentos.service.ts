import { Injectable, OnInit } from "@angular/core";
import { Client, IMessage, Stomp } from '@stomp/stompjs';
import { Subject } from "rxjs";
import SockJS from 'sockjs-client';

@Injectable({
    providedIn: "root"
})

export class ConfirmPagamentoSocketComponent {
    private stompClient!: Client;
    private pagamentoSubject = new Subject<any>();
    // essa resposta que vamos pegar dentor da api ao chamar o Socket  dessa form  this.socketService.pagamento$.subscribe(data => {const status = data.pagamento?.statusPagoPlano;console.log("Status do pagamento:", status);  })
    pagamento$ = this.pagamentoSubject.asObservable();
    socketWeb(email: string) {
      // canexao com servidor zapdai
        this.stompClient = new Client({
            webSocketFactory: () => new SockJS('https://server.zapdai.com/zapdai'),
            reconnectDelay: 5000,
            debug: () => { },
        });

        this.stompClient.onConnect = (frame) => {
            console.log("conectado")
            //bucando a resposta da api e retornando para o usuario 
            this.stompClient.subscribe(`/topic/pagamentos/${email}`, (msg: IMessage) => {
                const data = JSON.parse(msg.body);
                this.pagamentoSubject.next(data);

            })
            /// buscando usuario no banco de daos
            this.stompClient.publish({
                destination: '/app/busca',
                body: JSON.stringify({ email: 'elivandro78@gmail.com' }),
            });


        }

        this.stompClient.onStompError = (frame) => {
            console.error("Erro STOMP:", frame.headers['message']);
            console.error("Detalhes:", frame.body);
        };
        this.stompClient.activate();

    }

}
import { Injectable, OnInit } from "@angular/core";
import { Client, IMessage, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({
    providedIn: "root"
})

export class ConfirmPagamentoSocketComponent implements OnInit{
    private stompClient!: Client;
  
    ngOnInit(): void {
         this.socketWeb();
    }
    email = "elivandro78@gmail.com"

    socketWeb() {
       
        this.stompClient = new Client({
            webSocketFactory: () => new SockJS('https://server.zapdai.com/zapdai'),
            reconnectDelay: 5000,
            debug: () => {},
        });

        this.stompClient.onConnect = (frame) => {
            console.log("conectado")

            this.stompClient.subscribe(`/topic/pagamentos/${this.email}`, (msg: IMessage) => {
                 const data = JSON.parse(msg.body);
                        console.log("Data pagametno "+data.pagamento.statusPagoPlano)
                        return data;

            })
                this.sendMessage()
          
            
        }

        this.stompClient.onStompError = (frame) => {
            console.error("Erro STOMP:", frame.headers['message']);
            console.error("Detalhes:", frame.body);
        };
        this.stompClient.activate();

    }

    sendMessage() {
        this.stompClient.publish({
            destination: '/app/busca',
            body: JSON.stringify({ email: 'elivandro78@gmail.com' }),
        });
    }

}
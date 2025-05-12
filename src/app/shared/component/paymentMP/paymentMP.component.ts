import { AfterViewInit, Component, ElementRef, ViewChild, ChangeDetectorRef } from "@angular/core";
import { environment } from "../../../../environments/environment";

declare var MercadoPago: any;

@Component({
  selector: "app-paymentMP",
  standalone: true,
  imports: [],
  templateUrl: "./paymentMP.component.html",
  styleUrls: ["./paymentMP.component.scss"]
})
export class PaymentMPComponent implements AfterViewInit {
  @ViewChild('cardPaymentBrick_containerid') brickContainer!: ElementRef;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    if (!this.brickContainer) {
      console.error('Container do Brick não encontrado!');
      return;
    }

    this.cdRef.detectChanges(); // Garante que a mudança foi detectada antes da execução do código.

    const mp = new MercadoPago(environment.PublicKey_MercadoPago, {
      locale: 'pt-BR',
    });

    const bricksBuilder = mp.bricks();

    const settings = {
      initialization: {
        amount: 10000,
        preferenceId: '<PREFERENCE_ID>',  // Substitua pelo seu ID de preferência real
        payer: {
          firstName: '',
          lastName: '',
          email: '',
        },
      },
      customization: {
        visual: {
          style: {
            theme: 'default',
          },
        },
        paymentMethods: {
          creditCard: 'all',
          debitCard: 'all',
          ticket: 'all',
          bankTransfer: 'all',
          atm: 'all',
          onboarding_credits: 'all',
          wallet_purchase: 'all',
          maxInstallments: 1,
        },
      },
      callbacks: {
        onReady: () => {
          console.log('Brick pronto!');
        },
        onSubmit: ({ formData }: any) => {
          return new Promise((resolve, reject) => {
            fetch('/process_payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
            })
              .then((res) => res.json())
              .then((res) => {
                console.log('Pagamento processado:', res);
                resolve(res);
              })
              .catch((err) => {
                console.error('Erro no pagamento:', err);
                reject(err);
              });
          });
        },
        onError: (error: any) => {
          console.error('Erro no Brick:', error);
        },
      },
    };

    // Passando o nativeElement diretamente como o contêiner
    bricksBuilder.create('payment', this.brickContainer.nativeElement, settings);
  }
}

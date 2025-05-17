import { Component, Inject, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  standalone:true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Zapdai';
}

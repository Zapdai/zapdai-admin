import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

async function patchGlobals() {
  if (typeof window !== 'undefined') {
    (window as any).global = window;
    (window as any).process = (await import('process/browser')).default;
    (window as any).Buffer = (await import('buffer')).Buffer;
  }
}

patchGlobals().then(() => {
  bootstrapApplication(AppComponent, appConfig)
    .catch((err) => console.error(err));
});

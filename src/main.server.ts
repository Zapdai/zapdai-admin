import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';
import { destroyPlatform, getPlatform } from '@angular/core';

if (getPlatform()) {
  destroyPlatform();
}

const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;

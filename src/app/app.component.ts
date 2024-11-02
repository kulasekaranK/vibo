import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { StatusBar, Style } from '@capacitor/status-bar';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
    this.initializeApp();
    this.setAppTheme();
  }

  async initializeApp() {
    this.setStatusBarTheme();

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        this.setStatusBarTheme(e.matches);
      });
  }

  async setStatusBarTheme(
    isDark: boolean = window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    if (isDark) {
      await StatusBar.setBackgroundColor({ color: '#0e101d' });
      await StatusBar.setStyle({ style: Style.Dark });

      document.documentElement.classList.add('ion-palette-dark');
    } else {
      await StatusBar.setBackgroundColor({ color: '#f3f4ff' });
      await StatusBar.setStyle({ style: Style.Light });

      document.documentElement.classList.remove('ion-palette-dark');
    }
  }

  setAppTheme() {
    document.documentElement.classList.toggle('ion-palette-dark');
  }
}

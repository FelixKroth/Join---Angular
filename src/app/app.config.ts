import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { initializeAppCheck, ReCaptchaEnterpriseProvider, provideAppCheck } from '@angular/fire/app-check';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getRemoteConfig, provideRemoteConfig } from '@angular/fire/remote-config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync('noop'),
    provideFirebaseApp(() => initializeApp({
      apiKey: "AIzaSyCLklbUTQpeZYKJl9xvyC90q7Cd4T4oJMA",
      authDomain: "felix-kroth.de/join-angular", // <-- Update with your custom domain
      projectId: "simple-crm-e10fe",
      storageBucket: "simple-crm-e10fe.appspot.com",
      messagingSenderId: "191388457509",
      appId: "1:191388457509:web:9fe8f64cf43e4fa9cc3dcc"
    })),
    provideAuth(() => getAuth()),

    // Enable AppCheck correctly or ensure it's disabled for dev mode
    ...(isDevMode() ? [] : [provideAppCheck(() => {
      const provider = new ReCaptchaEnterpriseProvider('your-recaptcha-enterprise-site-key');
      return initializeAppCheck(undefined, { provider, isTokenAutoRefreshEnabled: true });
    })]),

    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    provideStorage(() => getStorage()),
    provideRemoteConfig(() => getRemoteConfig())
  ]
};
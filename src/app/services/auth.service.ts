// auth.service.ts
import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
} from '@angular/fire/auth';
import { Firestore, doc, setDoc, collection, addDoc } from '@angular/fire/firestore';
import { onAuthStateChanged, User as FirebaseUser } from '@firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authState = new BehaviorSubject<FirebaseUser | null>(null);

  constructor(private auth: Auth, private firestore: Firestore) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.authState.next(JSON.parse(storedUser));
    }

    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
      this.authState.next(user);
    });
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then(userCredential => {
        localStorage.setItem('user', JSON.stringify(userCredential.user));
        this.authState.next(userCredential.user);
      });
  }

  signup(email: string, password: string, firstName: string, lastName: string) {
    return createUserWithEmailAndPassword(this.auth, email, password).then(
      (userCredential) => {
        const user = userCredential.user;
        const userDocRef = doc(this.firestore, 'users', user.uid);
        const contactColor = this.generateRandomColor();

        localStorage.setItem('user', JSON.stringify(user));
        this.authState.next(user);

        return Promise.all([
          setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            firstName: firstName,
            lastName: lastName,
            createdAt: new Date(),
            color: contactColor,
          }),
          this.createContact(firstName, lastName, email, contactColor),
        ]);
      }
    );
  }

  guestLogin() {
    return signInAnonymously(this.auth).then(async (userCredential) => {
      const uid = userCredential.user.uid;
      const userColor = this.generateRandomColor();

      await setDoc(doc(this.firestore, 'users', uid), {
        uid,
        firstName: 'Guest',
        lastName: '',
        email: '',
        color: userColor,
        createdAt: new Date(),
      });
      localStorage.setItem('user', JSON.stringify(userCredential.user));
      this.authState.next(userCredential.user);
    });
  }

  logout() {
    localStorage.removeItem('user');
    return this.auth.signOut().then(() => {
      this.authState.next(null);
    });
  }

  getAuthState(): Observable<FirebaseUser | null> {
    return this.authState.asObservable();
  }

  private generateRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  private createContact(firstName: string, lastName: string, email: string, color: string) {
    const contactsCollection = collection(this.firestore, 'contacts');
    return addDoc(contactsCollection, {
      firstName,
      lastName,
      eMail: email,
      color,
      createdAt: new Date(),
    });
  }
}

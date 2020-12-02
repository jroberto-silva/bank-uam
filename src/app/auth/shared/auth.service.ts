import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { User } from './user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  public static FIREBASE_ERRORS = {
    'auth/email-already-in-use': 'Endereço de e-mail já utilizado.',
    'auth/invalid-email': 'Endereço de e-mail inválido.',
    'auth/user-not-found': 'Usuário ou senha inválidos.',
    'auth/weak-password': 'Senha deve ter no mínimo 6 dígitos.'
  };

  private userData: User;

  constructor(
    private angularFirestore: AngularFirestore,
    private angularFireAuth: AngularFireAuth,
    private router: Router
  ) {
    this.angularFireAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });
  }

  login(email: string, password: string) {
    return this.angularFireAuth.signInWithEmailAndPassword(email, password);
  }

  register(email: string, password: string) {
    return this.angularFireAuth.createUserWithEmailAndPassword(email, password);
  }

  sendEmailVerification() {
    return this.angularFireAuth.currentUser
      .then(user => user.sendEmailVerification({ url: environment.baseUrl }))
      .then(() => {
        this.router.navigate(['verify-email']);
      });
  }

  passwordReset(passwordResetEmail) {
    return this.angularFireAuth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        console.log('Email de reset de senha enviado. Verifique sua caixa de entrada.');
      }).catch((error) => {
        window.alert(error);
      });
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null && user.emailVerified !== false;
  }

  get isEmailVerified(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user.emailVerified !== false;
  }

  logout() {
    return this.angularFireAuth.signOut().then(() => {
      localStorage.removeItem('user');
      return this.router.navigate(['login']);
    });
  }
}

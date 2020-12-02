import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

import { AuthService } from '../auth/shared/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

  constructor(private authService: AuthService, private router: Router, private toastController: ToastController) {
  }

  ngOnInit() {
  }

  async presentToast(errorMessage) {
    const toast = await this.toastController.create({
      message: errorMessage ? errorMessage : 'Não foi possível efetuar seu cadastro no momento. Tente novamente mais tarde.',
      duration: 2000
    });

    await toast.present();
  }

  register(name, email, password) {
    this.authService.register(email.value, password.value)
      .then((userCredential) => {
        // Atualizar perfil do usuário:  userCredential.user.updateProfile({ displayName: name });
        this.authService.sendEmailVerification();
      })
      .catch(error => {
        return this.presentToast(AuthService.FIREBASE_ERRORS[error.code] || error);
      });
  }
}

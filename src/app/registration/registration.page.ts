import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { AuthService } from '../auth/shared/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

  constructor(private authService: AuthService, private router: Router, private alertController: AlertController) {
  }

  ngOnInit() {
  }

  async presentAlert(message, header = 'Ocorreu um Erro') {
    const alert = await this.alertController.create({ header, message, buttons: ['OK'] });
    await alert.present();
  }

  register(name, email, password) {
    this.authService.register(email.value, password.value)
      .then((userCredential) => {
        // Atualizar perfil do usuário:  userCredential.user.updateProfile({ displayName: name });
        this.authService.sendEmailVerification().then(() => {
          this.clearFields(name, email, password);
        });
      })
      .catch(error => {
        return this.presentAlert(AuthService.FIREBASE_ERRORS[error.code] || error);
      });
  }

  clearFields(name, email, password) {
    email.value = '';
    name.value = '';
    password.value = '';

    name.setFocus(true);
  }
}

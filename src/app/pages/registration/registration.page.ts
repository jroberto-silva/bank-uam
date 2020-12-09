import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

  constructor(
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private authService: AuthService,
  ) { }

  ngOnInit() {
  }

  async presentAlert(message, header = 'Ocorreu um Erro') {
    const alert = await this.alertController.create({ header, message, buttons: ['OK'] });
    await alert.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({});
    await loading.present();
  }

  async register(name, email, password) {
    await this.presentLoading();

    await this.authService.register(email.value, password.value)
      .then((userCredential) => {
        // Atualizar perfil do usuário:  userCredential.user.updateProfile({ displayName: name });
        this.authService.sendEmailVerification().then(() => this.clearFields(name, email, password));
      })
      .catch(error => this.presentAlert(AuthService.FIREBASE_ERRORS[error.code] || error));

    await this.loadingController.dismiss();
  }

  clearFields(name, email, password) {
    email.value = '';
    name.value = '';
    password.value = '';

    name.setFocus(true);
  }
}

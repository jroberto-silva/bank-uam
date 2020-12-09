import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private authService: AuthService
  ) {
  }

  async presentAlert(message, header = 'Erro no Login') {
    const alert = await this.alertController.create({ header, message, buttons: ['OK'] });
    await alert.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({});
    await loading.present();
  }

  ngOnInit() {
  }

  async login(email, password) {
    await this.presentLoading();

    await this.authService.login(email.value, password.value)
      .then((res) => {
        if (!res.user.emailVerified) {
          return this.presentAlert('Seu e-mail ainda não foi verificado. Por favor, acesse o link enviado para seu e-mail para finalizar o cadastro.')
            .then(() => this.router.navigate(['login']));
        }

        return this.router.navigate(['home']);
      })
      .catch((error) => this.presentAlert(AuthService.FIREBASE_ERRORS[error.code] || error));

    await this.loadingController.dismiss();
  }
}

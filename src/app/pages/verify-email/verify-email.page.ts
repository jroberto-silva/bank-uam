import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
})
export class VerifyEmailPage implements OnInit {

  constructor(
    private alertController: AlertController,
    private loadingController: LoadingController,
    private authService: AuthService
  ) { }

  async presentAlert(message, header = 'Ocorreu um erro') {
    const alert = await this.alertController.create({ header, message, buttons: ['OK'] });
    await alert.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({});
    await loading.present();
  }

  ngOnInit() {
  }

  async resendEmailVerification() {
    await this.presentLoading();

    await this.authService.sendEmailVerification()
      .then(() => {
        return this.presentAlert('Reenviamos um e-mail com o link para confirmar seu cadastro. Se não encontrar na caixa de entrada, favor verificar no spam.', 'Verifique seu Email');
      })
      .catch((error) => this.presentAlert(error));

    await this.loadingController.dismiss();
  }
}

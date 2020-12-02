import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { AuthService } from '../auth/shared/auth.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
})
export class VerifyEmailPage implements OnInit {

  constructor(private authService: AuthService, private alertController: AlertController) {
  }

  async presentAlert(message, header = 'Ocorreu um erro') {
    const alert = await this.alertController.create({ header, message, buttons: ['OK'] });
    await alert.present();
  }

  ngOnInit() {
  }

  resendEmailVerification() {
    this.authService.sendEmailVerification()
      .then(() => {
        return this.presentAlert('Reenviamos um e-mail com o link para confirmar seu cadastro. Se não encontrar na caixa de entrada, favor verificar no spam.', 'Verifique seu Email');
      })
      .catch((error) => {
        this.presentAlert(error);
      });
  }
}

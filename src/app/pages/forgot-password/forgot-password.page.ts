import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  constructor(
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private authService: AuthService
  ) {
  }

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

  async reset(email) {
    await this.presentLoading();

    await this.authService.passwordReset(email.value)
      .then((userCredential) => {
        email.value = '';
        this.router.navigate(['/forgot-password/email']);
      })
      .catch(error =>  this.presentAlert(AuthService.FIREBASE_ERRORS[error.code] || error));

    await this.loadingController.dismiss();
  }
}

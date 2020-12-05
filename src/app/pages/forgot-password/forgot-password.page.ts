import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {
  }

  ngOnInit() {
  }

  async presentAlert(message, header = 'Ocorreu um Erro') {
    const alert = await this.alertController.create({ header, message, buttons: ['OK'] });
    await alert.present();
  }

  reset(email) {
    this.authService.passwordReset(email.value)
      .then((userCredential) => {
        email.value = '';
        this.router.navigate(['/forgot-password/email']);
      })
      .catch(error => {
        return this.presentAlert(AuthService.FIREBASE_ERRORS[error.code] || error);
      });
  }
}

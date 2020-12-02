import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { AuthService } from 'src/app/auth/shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService,
  ) {
  }

  async presentAlert(message, header = 'Ocorreu no Login') {
    const alert = await this.alertController.create({ header, message, buttons: ['OK'] });
    await alert.present();
  }

  ngOnInit() {
  }

  login(email, password) {
    console.log(this.authService.isLoggedIn);
    this.authService.login(email.value, password.value)
      .then((res) => {

        if (!this.authService.isEmailVerified) {
          return this.router.navigate(['verify-email']);
        }

        return this.router.navigate(['home']);
      })
      .catch((error) => {
        return this.presentAlert(AuthService.FIREBASE_ERRORS[error.code] || error);
      });
  }
}

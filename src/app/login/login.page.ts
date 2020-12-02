import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

import { AuthService } from 'src/app/auth/shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private router: Router,
    private toastController: ToastController,
    private authService: AuthService,
  ) { }

  async presentToast(errorMessage) {
    const toast = await this.toastController.create({
      message: errorMessage ? errorMessage : 'Não foi possível efetuar login no momento. Tente novamente mais tarde.',
      duration: 2000
    });

    await toast.present();
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
        return this.presentToast(AuthService.FIREBASE_ERRORS[error.code] || error);
      });
  }
}

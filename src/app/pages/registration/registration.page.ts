import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth.service';
import { BankAccountService } from 'src/app/services/bank-account.service';

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
    private bankAccountService: BankAccountService
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
      .then(async (userCredential) => {
        /**
         * Definindo o nome do usuário no perfil criado no firebase
         */
        await userCredential.user.updateProfile({ displayName: name.value });

        /**
         * Criando uma conta bancária relacionado ao cliente recém cadastrado
         */
        await this.bankAccountService.createBankAccount(userCredential.user);

        /**
         * Enviando e-mail de verificação de cadastro
         */
        await this.authService.sendEmailVerification();

        this.clearFields(name, email, password);
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

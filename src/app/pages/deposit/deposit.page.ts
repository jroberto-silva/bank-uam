import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import firebase from 'firebase';
import QuerySnapshot = firebase.firestore.QuerySnapshot;
import { DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';

import { BankAccountService } from 'src/app/services/bank-account.service';
import { BankAccount } from 'src/app/models/bank.account.model';
import { User } from 'src/app/models/user.model';
import { TransactionService } from '../../services/transaction.service';
import { TransactionCategoryEnum, TransactionTypeEnum } from '../../models/transaction.model';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.page.html',
  styleUrls: ['./deposit.page.scss'],
})
export class DepositPage implements OnInit {

  public user: User;
  public bankAccount: BankAccount;
  public loadingBankAccount: boolean;

  public amount = new FormControl('');

  public email = new FormControl('', [
    Validators.required,
    Validators.email
  ]);

  public agency = new FormControl('', [
    Validators.required,
    Validators.maxLength(4),
    Validators.minLength(1),
  ]);

  public account = new FormControl('', [
    Validators.required,
    Validators.maxLength(5),
    Validators.minLength(5)
  ]);

  public digit = new FormControl('', [
    Validators.required,
    Validators.maxLength(1),
    Validators.minLength(1),
  ]);

  constructor(
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private transactionService: TransactionService,
    private bankAccountService: BankAccountService
  ) {
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user')) as User;

    if (!this.user) {
      return this.router.navigate(['/home']);
    }

    this.loadingBankAccount = true;

    this.bankAccountService.getUserBankAccounts(this.user)
      .then(snapshot => {
        this.bankAccount = snapshot.empty ? null : snapshot.docs[0].data() as BankAccount;
      })
      .finally(() => this.loadingBankAccount = false);
  }

  async presentAlert(message, header = 'Erro durante o depósito') {
    const alert = await this.alertController.create({ header, message, buttons: ['OK'] });
    await alert.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({});
    await loading.present();
  }

  public async save() {
    if (!this.valid) {
      return;
    }

    await this.presentLoading();

    await this.transactionService.createTransaction(
      this.bankAccount,
      TransactionTypeEnum.CREDIT,
      TransactionCategoryEnum.DEPOSIT,
      this.amount.value,
      '',
      {}
    )
      .then(() => {
        return this.router.navigate(['/home']);
      })
      .catch(erro => this.presentAlert(erro.toString()))
      .finally(() => this.loadingController.dismiss());
  }

  public get valid() {
    if (this.loadingBankAccount) {
      return false;
    }

    return this.validateAmount();
  }

  public validateAmount(): boolean {
    return this.amount.value > 0;
  }
}

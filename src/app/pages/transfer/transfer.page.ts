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
  selector: 'app-transfer',
  templateUrl: './transfer.page.html',
  styleUrls: ['./transfer.page.scss'],
})
export class TransferPage implements OnInit {

  readonly AMOUNT_STEP = 1;
  readonly DESTINATION_STEP = 2;
  readonly COMMENT_STEP = 3;
  readonly CONFIRM_STEP = 4;

  public step: number;

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

  public description = new FormControl('');

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
    this.step = this.AMOUNT_STEP;

    if (!this.user) {
      return this.router.navigate(['/home']);
    }

    this.loadingBankAccount = true;

    this.bankAccountService.getUserBankAccounts(this.user)
      .then(snapshot => {
        this.bankAccount = snapshot.empty ? null : snapshot.docs[0].data() as BankAccount;
        this.amount.setValidators(Validators.max(this.bankAccount.balance));
      })
      .finally(() => this.loadingBankAccount = false);
  }

  async presentAlert(message, header = 'Erro na transferência') {
    const alert = await this.alertController.create({ header, message, buttons: ['OK'] });
    await alert.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({});
    await loading.present();
  }

  public async continue() {
    if (!this.valid) {
      return;
    }

    if (this.step < this.CONFIRM_STEP) {
      return this.step++;
    }

    await this.presentLoading();

    const promiseBanking: Promise<QuerySnapshot<DocumentData | BankAccount>> = this.email.valid
      ? this.bankAccountService.getBankAccountByEmail(this.email.value)
      : this.bankAccountService.getBankAccountByAccountData(this.agency.value, this.account.value);

    promiseBanking
      .then(async (documents) => {
        if (documents.docs.length === 0) {
          throw new Error('Conta de destino não encontrada.');
        }

        const destinationBankAccount = documents.docs[0].data() as BankAccount;

        await this.transactionService
          .createTransaction(
            this.bankAccount,
            TransactionTypeEnum.DEBIT,
            TransactionCategoryEnum.TRANSFER,
            this.amount.value,
            this.description.value || '',
            {
              counterpartName: destinationBankAccount.displayName,
              counterpartBank: 'UAM Bank',
              counterpartAgency: destinationBankAccount.agency,
              counterpartAccountNumber: destinationBankAccount.number,
              counterpartAccountDigit: destinationBankAccount.digit
            }
          );

        await this.transactionService
          .createTransaction(
            destinationBankAccount,
            TransactionTypeEnum.CREDIT,
            TransactionCategoryEnum.TRANSFER,
            this.amount.value,
            '',
            {
              counterpartName: this.user.displayName,
              counterpartBank: 'UAM Bank',
              counterpartAgency: this.bankAccount.agency,
              counterpartAccountNumber: this.bankAccount.number,
              counterpartAccountDigit: this.bankAccount.digit
            }
          );

        return this.router.navigate(['/bank-account']);
      })
      .catch(erro => this.presentAlert(erro.toString()))
      .finally(() => this.loadingController.dismiss());
  }

  public prev() {
    if (this.step > this.AMOUNT_STEP) {
      this.step--;
    }
  }

  public get valid() {
    if (this.loadingBankAccount) {
      return false;
    }

    if (this.step === this.AMOUNT_STEP) {
      return this.validateAmount();
    }

    if (this.step === this.DESTINATION_STEP) {
      return this.validateDestination();
    }

    if (this.step === this.CONFIRM_STEP) {
      return this.validateAmount() && this.validateDestination();
    }

    return true;
  }

  public validateAmount(): boolean {
    return this.amount.value > 0 && this.amount.valid;
  }

  public validateDestination(): boolean {
    return this.email.valid || (this.agency.valid && this.account.valid && this.digit.valid);
  }
}

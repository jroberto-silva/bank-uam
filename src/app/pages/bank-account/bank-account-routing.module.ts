import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BankAccountPage } from './bank-account.page';

const routes: Routes = [
  {
    path: '',
    component: BankAccountPage
  },
  {
    path: 'transaction/:tid',
    loadChildren: () => import('./transaction/transaction.module').then( m => m.TransactionPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BankAccountPageRoutingModule {}

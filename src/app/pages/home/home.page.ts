import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public user: User;

  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user')) as User;
  }
}

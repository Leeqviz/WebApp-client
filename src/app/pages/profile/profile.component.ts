import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserData } from 'src/app/interfaces/account.interfaces';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public userData: Observable<UserData> | undefined

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.userData = this.accountService.getUserData();
  }

}

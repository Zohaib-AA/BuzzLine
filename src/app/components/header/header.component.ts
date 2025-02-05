import { Component, OnDestroy, OnInit } from '@angular/core';
import { Auth } from '../../interfaces&constants/key.constant';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: false,

  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {

  authMode = Auth;
  public userAuthenticated = false;
  private authListenerSub!: Subscription;

  constructor(public router: Router, public authService: AuthService) { }

  ngOnInit(): void {
    this.authListenerSub = this.authService.getAuthListener().subscribe(isAuthenticated => {
      this.userAuthenticated = isAuthenticated;
    })
  }

  onClick(mode: string) {
    this.router.navigate(['/account/', mode]);
  }

  onLogout(){
    this.authService.logout()
  }

  ngOnDestroy(): void {
    this.authListenerSub.unsubscribe();
  }

}

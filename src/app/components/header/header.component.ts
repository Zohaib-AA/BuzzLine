import { Component } from '@angular/core';
import { Auth } from '../../interfaces&constants/key.constant';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,

  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  authMode = Auth;

  constructor(public router: Router) { }

  onClick(mode: string) {

    this.router.navigate(['/account/' , mode]);
  }

}

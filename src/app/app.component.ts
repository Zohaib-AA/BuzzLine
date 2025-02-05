import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'BuzzLine';
  constructor(private authService: AuthService) { }
  ngOnInit(): void {
    this.authService.autoAuthUser();
  }
}

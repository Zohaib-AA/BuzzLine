import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Auth } from '../../../interfaces&constants/key.constant';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: false,

  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  loginForm: FormGroup;
  isSubmit = false;
  actionText: string = Auth.login;
  authSub!: Subscription;

  constructor(public authService: AuthService, private route: ActivatedRoute) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
    this.route.paramMap.subscribe((param: ParamMap) => {
      if (param.has('account')) {
        this.actionText = param.get('account') ?? Auth.login;
      }
    })
  }

  ngOnInit(): void {
    this.authSub = this.authService.getAuthListener().subscribe(auth => {
      if (!auth) {
        this.isLoading = false;
        this.resetForm();
      }
    })
  }
  onClick(form: FormGroupDirective) {
    if (this.loginForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(this.loginForm.value.email, this.loginForm.value.password, this.actionText);
  }

  resetForm() {
    this.isLoading = false;
    this.isSubmit = false;
    this.loginForm.reset();
  }

  get validate() {
    return this.loginForm.controls;
  }

  submitForm(mode: string) {
    this.actionText = mode;
    this.isSubmit = true;
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }
}

import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  isLoading = false;
  loginForm: FormGroup;
  isSubmit = false;

  constructor(public authService: AuthService) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    })
  }

  onLogin(form: FormGroupDirective) {
    if(this.loginForm.invalid){
      return;
    }
    console.log(this.loginForm);
    this.authService.createUser(this.loginForm.value.email, this.loginForm.value.password);
  }

  get validate(){
    return this.loginForm.controls;
  }

  submitForm(){
    this.isSubmit = true;
  }

}

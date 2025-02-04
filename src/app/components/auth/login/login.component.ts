import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Auth } from '../../../interfaces&constants/key.constant';

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
  actionText : string = Auth.login;

  constructor(public authService: AuthService, private route: ActivatedRoute) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
    this.route.paramMap.subscribe((param:ParamMap)=>{
      if(param.has('account')){
        this.actionText = param.get('account') ?? Auth.login;
      }
    })
  }

  onClick(form: FormGroupDirective) {
    if(this.loginForm.invalid){
      return;
    }
    console.log(this.loginForm);
    if(this.actionText == Auth.signup){
      this.authService.createUser(this.loginForm.value.email, this.loginForm.value.password);
    }
  }

  get validate(){
    return this.loginForm.controls;
  }

  submitForm(mode: string){
    this.actionText = mode;
    this.isSubmit = true;
  }

}

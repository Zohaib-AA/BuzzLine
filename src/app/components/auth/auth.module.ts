import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AngularMaterialModule } from "../../angular-material.module";
import { LoginComponent } from "./login/login.component";
import { AuthRoutingModule } from "./auth-routing.module";

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    AngularMaterialModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }

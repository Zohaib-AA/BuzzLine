import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AngularMaterialModule } from "../../angular-material.module";
import { AppRoutingModule } from "../../app-routing.module";
import { LoginComponent } from "./login/login.component";

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    AngularMaterialModule,
    AppRoutingModule
  ]
})
export class AuthModule { }

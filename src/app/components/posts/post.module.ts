import { ReactiveFormsModule } from "@angular/forms";
import { PostCreateComponent } from "./post-create/post-create.component";
import { PostListComponent } from "./post-list/post-list.component";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AngularMaterialModule } from "../../angular-material.module";
import { AppRoutingModule } from "../../app-routing.module";

@NgModule({
  declarations: [
    PostCreateComponent,
    PostListComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    AngularMaterialModule,
    AppRoutingModule
  ]
})
export class PostModule { }

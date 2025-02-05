import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './components/posts/post-list/post-list.component';
import { PostCreateComponent } from './components/posts/post-create/post-create.component';
import { LoginComponent } from './components/auth/login/login.component';
import { AuthGuard } from './pipes&validators/auth.guard';

const routes: Routes = [
  { path: '', component: PostListComponent },
  { path: 'create', component: PostCreateComponent , canActivate: [AuthGuard] },
  { path: 'edit/:buzzId', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'account/:account', component: LoginComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Buzz } from '../../../interfaces&constants/buzz.interface';
import { PostService } from '../../../services/post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-post-list',
  standalone: false,

  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})
export class PostListComponent implements OnInit, OnDestroy {
  buzz: Buzz[] = [];
  private buzzSub: Subscription;
  private authSub!: Subscription
  isLoading: boolean = false;
  buzzCount: number = 0;
  pageSize = 3;
  pageSizeOptions = [3, 6, 9];
  currentPage: number = 1;
  userAuthenticated: boolean = false;
  userId: string = '';

  constructor(private buzzService: PostService, private authService: AuthService) {
    this.buzzSub = this.buzzService.buzzUpdateListener().subscribe((fetchedData: any) => {
      this.buzz = fetchedData.chatData;
      this.buzzCount = fetchedData.maxCount;
      this.isLoading = false;
    });
  }
  ngOnInit(): void {
    this.isLoading = true;
    this.userId = this.authService.userAuthorized;
    this.buzzService.getBuzz(this.pageSize, this.currentPage);
    this.userAuthenticated = this.authService.userAuthentication;
    this.authSub = this.authService.getAuthListener().subscribe(isAuthenticated => {
      this.userAuthenticated = isAuthenticated;
      this.userId = this.authService.userAuthorized;
    })
  }

  onDelete(buzzId: string) {
    this.buzzService.removeBuzz(buzzId);
  }

  handlePageEvent(event: PageEvent) {
    console.log(typeof (event));
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.buzzService.getBuzz(this.pageSize, this.currentPage);
  }
  ngOnDestroy(): void {
    this.buzzSub.unsubscribe();
    this.authSub.unsubscribe();
  }
}

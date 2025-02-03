import { Component, OnDestroy, OnInit } from '@angular/core';
import { Buzz } from '../../../interfaces&constants/buzz.interface';
import { PostService } from '../../../services/post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-post-list',
  standalone: false,

  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})
export class PostListComponent implements OnInit, OnDestroy {
  buzz: Buzz[] = [];
  private buzzSub: Subscription;
  isLoading : boolean = false;
  buzzCount: number = 0;
  pageSize = 3;
  pageSizeOptions = [3,6,9];
  currentPage: number = 1;

  constructor(private buzzService: PostService) {
    this.buzzSub = this.buzzService.buzzUpdateListener().subscribe((fetchedData: any) => {
      this.buzz = fetchedData.chatData;
      this.buzzCount = fetchedData.maxCount;
      this.isLoading = false;
    });
  }
  ngOnInit(): void {
    this.isLoading = true;
    this.buzzService.getBuzz(this.pageSize, this.currentPage);
  }

  onDelete(buzzId: string) {
    this.buzzService.removeBuzz(buzzId);
  }

  handlePageEvent(event:PageEvent){
    console.log(typeof(event));
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.buzzService.getBuzz(this.pageSize, this.currentPage);
  }
  ngOnDestroy(): void {
    this.buzzSub.unsubscribe();
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Buzz } from '../../../interfaces&constants/buzz.interface';
import { PostService } from '../../../services/post.service';
import { Subscription } from 'rxjs';

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

  constructor(private buzzService: PostService) {
    this.buzzSub = this.buzzService.buzzUpdateListener().subscribe((buzz: Buzz[]) => {
      this.buzz = buzz;
      this.isLoading = false;
    });
  }
  ngOnInit(): void {
    this.isLoading = true;
    this.buzzService.getBuzz();
  }

  onDelete(buzzId: string) {
    this.buzzService.removeBuzz(buzzId);
  }
  ngOnDestroy(): void {
    this.buzzSub.unsubscribe();
  }
}

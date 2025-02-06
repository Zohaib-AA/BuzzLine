import { Injectable } from '@angular/core';
import { Buzz } from '../interfaces&constants/buzz.interface';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private buzz: Buzz[] = [];
  private buzzUpdate = new Subject<{chatData: Buzz[],maxCount: number}>();

  constructor(private http: HttpClient, public route: Router) { }

  getBuzz(pageSize: number, currrentPage: number) {
    const params = `?pageSize=${pageSize}&currentPage=${currrentPage}`;
    this.http.get<{ message: string, posts: any, maxCount: number }>('http://localhost:3000/api/posts'+params).pipe(map((postData) => {
      return {
         posts:  postData.posts.map((post: any) => {
          return { 
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator
          }
      }),
      maxCount: postData.maxCount};
    }))
      .subscribe((buzzdata) => {
        this.buzz = buzzdata.posts;
        this.buzzUpdate.next({chatData: [...this.buzz], maxCount:  buzzdata.maxCount});
      })
  }

  buzzUpdateListener() {
    return this.buzzUpdate.asObservable();
  }

  addBuzz(title: string, content: string, image: File) {
    const newData = new FormData();
    newData.append(
      'title', title
    );
    newData.append(
      'content', content
    );
    newData.append(
      'image', image, title
    );

    this.http.post<{ message: string, buzz: Buzz }>('http://localhost:3000/api/posts', newData).subscribe((responseData) => {
      console.log(responseData);
      const buzz: Buzz = { id: responseData.buzz.id, title: title, content: content, imagePath: responseData.buzz.imagePath, creator: '' };
      this.buzz.push(buzz);
      this.buzzUpdate.next({chatData:  [...this.buzz], maxCount: 1});
      this.route.navigate(['/']);
    })
  }

  removeBuzz(buzzId: string) {
    this.http.delete<{message: string, maxCount: number}>('http://localhost:3000/api/posts/' + buzzId).subscribe((buzzdata) => {
      this.buzz = this.buzz.filter(bz => bz.id != buzzId);
      this.buzzUpdate.next({chatData:  [...this.buzz], maxCount: buzzdata.maxCount});
    })
  }

  getBuzzWithId(buzzId: string) {
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string, creator: string }>('http://localhost:3000/api/posts/' + buzzId);
  }

  updateBuzz(buzzId: string, title: string, content: string, image: File | string) {

    let updatedBuzz: Buzz | FormData;
    if (typeof (image) === 'object') {
      updatedBuzz = new FormData();
      updatedBuzz.append('id', buzzId);
      updatedBuzz.append('title', title);
      updatedBuzz.append('content', content);
      updatedBuzz.append('image', image, title);
    } else {
      updatedBuzz = {
        title: title,
        content: content,
        imagePath: image,
        id: buzzId,
        creator : ''
      }
    }
    this.http.put('http://localhost:3000/api/posts/' + buzzId, updatedBuzz).subscribe((result) => {
      this.route.navigate(['/'])
    })
  }
}

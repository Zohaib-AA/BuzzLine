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
  private buzzUpdate = new Subject<Buzz[]>();

  constructor(private http: HttpClient, public route: Router) { }

  getBuzz() {
    this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/posts').pipe(map((postData) => {
      return postData.posts.map((post: any) => {
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath
        }
      });
    }))
      .subscribe((buzzdata) => {
        this.buzz = buzzdata;
        this.buzzUpdate.next([...this.buzz]);
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
      const buzz: Buzz = { id: responseData.buzz.id, title: title, content: content, imagePath: responseData.buzz.imagePath };
      this.buzz.push(buzz);
      this.buzzUpdate.next([...this.buzz]);
      this.route.navigate(['/']);
    })
  }

  removeBuzz(buzzId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + buzzId).subscribe(() => {
      this.buzz = this.buzz.filter(bz => bz.id != buzzId)
      this.buzzUpdate.next([...this.buzz])
    })
  }

  getBuzzWithId(buzzId: string) {
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string }>('http://localhost:3000/api/posts/' + buzzId);
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
        id: buzzId
      }
    }
    this.http.put('http://localhost:3000/api/posts/' + buzzId, updatedBuzz).subscribe((result) => {
      const buzz = { title: title, content: content, id: buzzId, imagePath: ''}
      console.log(result);
      this.route.navigate(['/'])
    })
  }
}

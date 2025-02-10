import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { PostService } from '../../../services/post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Mode } from '../../../interfaces&constants/key.constant';
import { Buzz } from '../../../interfaces&constants/buzz.interface';

import { mimeType } from '../../../pipes&validators/mime-validator';

@Component({
  selector: 'app-post-create',
  standalone: false,

  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.scss'
})
export class PostCreateComponent implements OnInit {
  buzzForm: FormGroup;
  isSubmit: boolean = false;
  mode: string = Mode.create;
  buzzId: string = '';
  buzz!: Buzz;
  isLoading: boolean = false;
  imagePreview: any;
  constructor(public buzzService: PostService, public route: ActivatedRoute) {
    this.buzzForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      content: new FormControl('', [Validators.required]),
      image: new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] })
    })
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('buzzId')) {
        this.mode = Mode.edit;
        this.buzzId = paramMap.get('buzzId') ?? '';
        this.isLoading = true;
        this.buzzService.getBuzzWithId(this.buzzId).subscribe(postData => {
          this.buzz = { id: postData._id, title: postData.title, content: postData.content, imagePath: postData.imagePath ?? '', creator: postData.creator }
          this.buzzForm.patchValue({ title: this.buzz?.title ?? '' });
          this.buzzForm.patchValue({ content: this.buzz?.content ?? '' });
          this.buzzForm.patchValue({ image: this.buzz?.imagePath ?? '' });
          this.imagePreview = postData.imagePath;
          this.isLoading = false;
        }, () => {
          this.isLoading = false;
        });
      } else {
        this.mode = Mode.create;
        this.buzzId = '';
      }
    })
  }

  onAddBuzz(matForm: FormGroupDirective) {
    if (this.buzzForm.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === Mode.create) {
      this.buzzService.addBuzz(this.validate['title'].value, this.validate['content'].value, this.validate['image'].value)
    } else {
      this.buzzService.updateBuzz(this.buzzId, this.validate['title'].value, this.validate['content'].value, this.validate['image'].value)
    }
    this.isSubmit = false;
    this.buzzForm.reset();
    matForm.resetForm();
  }

  get validate() {
    return this.buzzForm.controls;
  }
  public submitForm() {
    this.isSubmit = true;
  }

  onImageAdd(event: Event) {
    const file = (event.target as HTMLInputElement)?.files;
    const newFile = file && file[0];
    if (newFile) {
      this.buzzForm.patchValue({
        image: newFile
      });
      this.buzzForm.get('image')?.updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result ?? '';
      }
      reader.readAsDataURL(newFile);
    }

    console.log(file);
    console.log(this.buzzForm);
  }
}

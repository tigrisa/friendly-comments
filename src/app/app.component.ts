import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  // comment: string = '';
  formattedComment: string = '';
  commentForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.commentForm = this.fb.group({
      comment: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.commentForm.valid) {
      const comment = this.commentForm.value.comment;
      // стишки даже 4рка генерит так себе
      // const prompt = `Напиши четверостишье, используя этот комментарий: ${comment}`;
      const prompt = `I have got a comment about our report. I want you to analize this comment. Make this comment friendly, positive and add gratitude to the report's authors using Russian language. Here is the comment: ${comment}`;
      this.getRewrittenComment(prompt);
    }
  }

  async getRewrittenComment(prompt: string) {
    const apiKey = 'your OPEN AI API key';
    const apiUrl = 'https://api.openai.com/v1/completions';

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    };

    const body = {
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 500,
      temperature: 0.7,
    };

    this.http
      .post(apiUrl, body, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error during API call:', error);
          this.formattedComment =
            'An error occurred while generating the response.';
          return throwError(error);
        })
      )
      .subscribe((response: any) => {
        const choices = response['choices'];
        if (choices && choices.length > 0) {
          this.formattedComment = choices[0].text.trim();
        } else {
          this.formattedComment = 'Sorry, I could not generate a response.';
        }
      });
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PromptService {
  private promptSubject = new BehaviorSubject<string>(''); // Initialize with an empty string
  prompt$ = this.promptSubject.asObservable(); // Observable to provide the prompt

  constructor() {}

  setPrompt(prompt: string) {
    this.promptSubject.next(prompt); // Update the prompt
  }
}

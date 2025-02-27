import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.css']
})
export class ChatInputComponent {
  public message: string = '';

  @Output() messageSent = new EventEmitter<string>();

  sendMessage() {
    if (this.message.trim()) {
      this.messageSent.emit(this.message); // Emit the message
      this.message = ''; // Clear the input field
    }
  }
}

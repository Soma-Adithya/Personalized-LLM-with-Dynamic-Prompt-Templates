import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  public messages: { sender: string, text: string }[] = [];
  public prompts: string[] = []; // Array to store the prompts

  constructor(private http: HttpClient) { }

  // Handle when a user sends a message
  onMessageSent(message: string) {
    this.messages.push({ sender: 'User', text: message });

    // Send the message to the Flask backend and get the response
    this.sendMessageToBackend(message).subscribe((response: any) => {
      const botReply = response.reply ? response.reply : 'I didn\'t understand that.';
      this.messages.push({ sender: 'Bot', text: botReply });

      // Optionally view prompt after receiving a bot reply
      this.viewPrompt(message);
    });
  }

  // Send a message to the Flask backend using POST request
  sendMessageToBackend(message: string): Observable<any> {
    const apiUrl = 'http://localhost:5000/chatbot'; // Flask API endpoint

    // Create the body for the POST request
    const body = { user_query: message };

    // Send a POST request with the message in the body
    return this.http.post<any>(apiUrl, body).pipe(
      catchError(error => {
        console.error('Error sending message to backend:', error);
        return of({ reply: 'An error occurred.' });
      })
    );
  }

  // Call backend to get prompt based on user input using GET request
  viewPrompt(message: string) {
    const apiUrl = `http://localhost:5000/api/prompts?query=${encodeURIComponent(message)}`; // Flask endpoint with query parameter

    // Send a GET request with the message as a query parameter
    this.http.get<any>(apiUrl).pipe(
      catchError(error => {
        console.error('Error retrieving prompt:', error);
        return of({ prompt: '' });
      })
    ).subscribe((response: any) => {
      if (response.prompt) {
        this.prompts.push(response.prompt); // Add the prompt to the sidebar

        // Generate and download PDF of the prompt
        // this.generatePDF(response.prompt);
      }
    });
  }

  // Generate and download PDF of the prompt
  private generatePDF(prompt: string) {
    const doc = new jsPDF();
    doc.text(prompt, 10, 10);
    doc.save('prompt.pdf');
  }
}

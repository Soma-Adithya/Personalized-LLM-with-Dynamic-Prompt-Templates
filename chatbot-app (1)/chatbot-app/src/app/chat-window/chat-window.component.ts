import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PromptService } from '../services/prompt.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent {
  @Input() messages: any[] = [];  // Messages array containing User/Bot messages

  constructor(private http: HttpClient, private promptService: PromptService) {}

  viewPrompt(userMessage: string) {
    console.log('Fetching prompt for:', userMessage);

    this.http.get<any>(`http://127.0.0.1:5000/api/prompts?query=${encodeURIComponent(userMessage)}`)
      .subscribe(
        (response) => {
          if (response && response.prompt) {
            console.log('Prompt received:', response.prompt);

            // Update the single prompt in the shared service
            this.promptService.setPrompt(response.prompt);

            // Generate and download PDF of the prompt
            this.generatePDF(response.prompt);
          } else {
            console.warn('No prompt found in response:', response);
          }
        },
        (error) => {
          console.error('Error fetching prompt:', error);
        }
      );
  }

  // Generate and download PDF of the prompt
  private generatePDF(prompt: string) {
    // Create a new PDF with custom dimensions (Letter size)
    const doc = new jsPDF({
      orientation: 'portrait',  // Can be 'portrait' or 'landscape'
      unit: 'mm',               // Unit of measurement
      format: [250, 800]        // Custom page dimensions (Letter size: 216mm x 279mm)
    });
  
    // Set the font size
    doc.setFontSize(10);  // Set font size to 16 points (larger text)
  
    // Add the prompt text to the PDF
    doc.text(prompt, 10, 10);  // Position the text at (x: 10mm, y: 20mm)
  
    // Save the PDF with the specified filename
    doc.save('promptTemplate.pdf');
  }}
import { Component, OnInit } from '@angular/core';
import { PromptService } from '../services/prompt.service';  // Import the service

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  prompt: string = '';  // Single prompt to display

  constructor(private promptService: PromptService) {}

  ngOnInit(): void {
    // Subscribe to prompt changes in the PromptService
    this.promptService.prompt$.subscribe((data) => {
      this.prompt = data;
      console.log('Sidebar prompt updated:', this.prompt);
    });
  }
}

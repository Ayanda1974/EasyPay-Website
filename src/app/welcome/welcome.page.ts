import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  showVideo: boolean = false;
  selectedButton: string | null = null;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onButtonClick(buttonName: string) {
    this.selectedButton = buttonName;
  }

  backToButtons() {
    this.selectedButton = null;
  }

  navigateToLogin() {
    this.router.navigate(['/login']); // Adjust the path according to your routing setup
  }
}
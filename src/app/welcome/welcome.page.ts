import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  showVideo: boolean = false;
  selectedButton: string | null = null;
  contactForm!: FormGroup;

  constructor(private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit() {
    // Initialize the contact form with validation
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  onButtonClick(buttonName: string) {
    this.selectedButton = buttonName;
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log('Form Submitted!', this.contactForm.value);
      // Process the form submission here (e.g., send data to server)
      this.contactForm.reset();  // Reset the form after submission
    } else {
      console.log('Form is not valid');
    }
  }

  backToButtons() {
    this.selectedButton = null;
  }

  navigateToLogin() {
    this.router.navigate(['/login']);  // Adjust the path according to your routing setup
  }
}

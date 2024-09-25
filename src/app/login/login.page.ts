import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

interface Admin {
  adminId: string;
  email: string;
  name: string;
  password: string;
  role: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private toastController: ToastController
  ) {}

  async login() {
    if (this.email === '' || this.password === '') {
      this.showToast('Please enter both email and password.');
      return;
    }

    try {
      const adminRef = this.firestore.collection<Admin>('admin', ref => ref.where('email', '==', this.email).limit(1));
      const snapshot = await adminRef.get().toPromise();

      if (snapshot && snapshot.docs.length > 0) {
        const admin = snapshot.docs[0].data() as Admin;  // Cast the data to the Admin type

        if (admin.password === this.password) {
          this.showToast(`Welcome, ${admin.name}!`);
          this.router.navigate(['/dashboard']);  // Navigate to the admin dashboard
        } else {
          this.showToast('Incorrect password.');
        }
      } else {
        this.showToast('Admin not found.');
      }
    } catch (error) {
      this.showToast('Error logging in. Please try again.');
      console.error('Login error:', error);
    }
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }
}

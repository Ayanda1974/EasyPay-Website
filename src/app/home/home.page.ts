import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

interface Vehicle {
  email: string;
  ownerName: string;
  password?: string; // Optional and excluded from display
  transportNumber: string;
  transportType: string;
  vehicleId: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  vehicle!: Observable<Vehicle[]>;

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  ngOnInit() {
    // Fetching vehicle data
    this.vehicle = this.firestore.collection<Vehicle>('vehicles').valueChanges();
  }

  logout() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);
      console.log('Admin logged out successfully');
    }).catch(error => {
      console.error('Error logging out:', error);
    });
  }

  assignAdmin(email: string) {
    if (!email) {
      console.error('Invalid Email address.');
      return;
    }

    console.log(`Attempting to assign admin role to: ${email}`);

    this.firestore.collection('admin').doc(email).set({ role: 'admin' }, { merge: true })
      .then(() => {
        console.log(`Successfully assigned admin role to: ${email}`);
      })
      .catch(error => {
        console.error('Error assigning admin:', error);
      });
  }
  
  deleteUser(email: string) {
    if (!email) {
      console.error('Invalid Email address.');
      return;
    }

    this.firestore.collection('vehicle').doc(email).delete()
      .then(() => {
        console.log(`${email} has been deleted.`);
      })
      .catch(error => {
        console.error('Error deleting user:', error.message);
      });
  }


}

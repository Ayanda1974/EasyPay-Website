import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

interface Passenger {
  balance: number;
  passengerEmail: string;
  passengerId: string;
  passengerNames: string;
  // Excluding passengerPassword
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  passengers!: Observable<Passenger[]>;

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private afAuth: AngularFireAuth
  ) { }

  ngOnInit() {
    // Fetching passenger data
    this.passengers = this.firestore.collection<Passenger>('passengers').valueChanges();

    this.passengers.subscribe(data => {
      console.log('Passenger data:', data);
    }, error => {
      console.error('Error fetching passenger data:', error);
    });
  }

  navigateHome() {
    this.router.navigate(['/home']);
  }

  assignAdmin(passengerEmail: string) {
    if (!passengerEmail) {
      console.error('Invalid Email address.');
      return;
    }

    this.firestore.collection('admin').doc(passengerEmail).set({ role: 'admin' })
      .then(() => {
        console.log(`${passengerEmail} has been assigned as admin.`);
      })
      .catch(error => {
        console.error('Error assigning admin:', error.message);
      });
  }

  deleteUser(passengerEmail: string) {
    if (!passengerEmail) {
      console.error('Invalid Email address.');
      return;
    }

    this.firestore.collection('passengers').doc(passengerEmail).delete()
      .then(() => {
        console.log(`${passengerEmail} has been deleted.`);
      })
      .catch(error => {
        console.error('Error deleting user:', error.message);
      });
  }

  logout() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);
      console.log('Admin logged out successfully');
    }).catch(error => {
      console.error('Error logging out:', error);
    });
  }
}

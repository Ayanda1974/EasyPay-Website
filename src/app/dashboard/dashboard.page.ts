import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NavController } from '@ionic/angular'; // Import NavController
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

interface Transaction {
  Amount: number;
  From_To: string;
  TransactionID: string;
  VehicleId: string;
  dateTime: string;
  passengerId: string;
  passengerEmail?: string;
  vehicleEmail?: string;
}

interface LoginData {
  loginCount: number;
  logins: string[];
}
export interface Vehicle {
  vehicleId:string;
  ownerName: string;
  email: string;
  transportType: string;
  transportNumber: string;
  password: string;

  amount?:number;
  from_to?:string;
}
export interface passenger{
  balance?: number;
  passengerId:string;
  passengerNames:string;
  passengerEmail:string;
  passengerPassword:string;
  phone?:string;
  address?:string;
}

interface Route {
  from: string;
  to: string;
  amount: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  cards = [
    { title: 'Registered Users', count: 0, icon: 'people-outline' },
    { title: 'Registered Drivers', count: 0, icon: 'car-outline' },
    { title: 'Transactions', count: 0, icon: 'cash-outline' },
    { title: 'Routes', count: 120, icon: 'map-outline' }
  ];
  
  vehicles: (Vehicle & { name: string; surname: string,transactionCount :number,loginCount:number})[] = [];

 passengers: (passenger & { name: string; surname: string,transactionCount :number,loginCount:number})[] = [];

 transactions: Transaction[]=[];
  loginCount:number =0;
  passengerCount:number = 0;

  route = {
    from: '',
    to: '',
    amount: 0,
  };

  routes:any[]=[];


  showDiv: boolean[] = []; 
  activeCard: string = 'Registered Users'; // Set default active card
  smallCard: string = 'Routes';

  constructor(private firestore: AngularFirestore,
    private alertController: AlertController, 
    private navCtrl: NavController,
  ) {
    this.showDiv = new Array(this.cards.length).fill(false);
  }

  ngOnInit() {
    this.getTransactions();
    this.getRoutes();
    this. getVehicles();
    this. getPassenger();
 
  }
 
  // Method to set the active card
  setActiveCard(cardId: string) {

    if(cardId === 'Transactions' || cardId === 'Registered Users' || cardId === 'Registered Drivers')
    {
      this.activeCard = cardId;
    }
    else
    {
      this.smallCard = cardId;
    }
    
  }

  logout() {
    // Clear user session or token (if applicable)
    localStorage.removeItem('userToken'); // Example: Remove user token from local storage

    // Navigate back to the login or welcome page
    this.navCtrl.navigateRoot('/login'); // Replace '/login' with your login page route
  }


  getVehicles() {
    this.firestore.collection<Vehicle>('vehicles').snapshotChanges().subscribe(async (res) => {
     
     this.cards[1].count = res.length;

      this.vehicles = await Promise.all(
        res.map(async (e) => {
          const data = e.payload.doc.data() as Vehicle;
          const id = e.payload.doc.id;

          // Split ownerName into name and surname
          const [name, surname] = data.ownerName ? data.ownerName.split(' ') : ['', ''];

          // Count transactions for this vehicle
          const transactionCount = await this.countTransactions(data.vehicleId);
          const loginCount = await this.getLoginCount(data.vehicleId);

          return { id, ...data, name, surname, transactionCount,loginCount };
        })
      );
    });
  }

  async getLoginCount(vehicleId: string): Promise<number> {
    // Attempt to get the document for the given vehicleId
    const loginDataDoc = await this.firestore.collection<LoginData>('historyLogins').doc(vehicleId).get().toPromise();

    // Check if the document exists and return loginCount
    if (loginDataDoc && loginDataDoc.exists) { // Check if loginDataDoc is defined and exists
      const loginData = loginDataDoc.data() as LoginData; // Fetch the data
      return loginData.loginCount;
    }
    
    return 0; 
  }

  private async countTransactions(vehicleId: string): Promise<number> {
    const transactionRef = this.firestore.collection<Transaction>('transactions', ref => 
      ref.where('vehicleId', '==', vehicleId)
    );
    const transactionsSnapshot = await transactionRef.get().toPromise();
    return transactionsSnapshot ? transactionsSnapshot.docs.length : 0; 
  }

  private async  Transactions(id: string): Promise<number> {
    const transactionRef = this.firestore.collection<Transaction>('transactions', ref => 
      ref.where('passengerId', '==', id)
    );
    // Fetch the transaction snapshot
    const transactionsSnapshot = await transactionRef.get().toPromise();
    // Check if transactionsSnapshot is defined
    return transactionsSnapshot ? transactionsSnapshot.docs.length : 0; // Return the count or 0 if undefined
  }
  getPassenger() {
    this.firestore.collection<passenger>('passengers').snapshotChanges().subscribe(async (res) => {
     
     this.cards[0].count = res.length;

      this.passengers = await Promise.all(
        res.map(async (e) => {
          const data = e.payload.doc.data() as passenger;
          const id = e.payload.doc.id;

          // Split ownerName into name and surname
          const [name, surname] = data.passengerNames ? data.passengerNames.split(' ') : ['', ''];

          // Count transactions for this vehicle
          const transactionCount = await this.Transactions(data.passengerId);
          const loginCount = await this.getLoginCount(data.passengerId);

          return { id, ...data, name, surname, transactionCount,loginCount };
        })
      );
    });
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }



  onSubmit() {

    if (!this.route.from || !this.route.to || this.route.amount === 0) {
      this.presentAlert('Note', 'All fields are required');
      return;
    }
  
    this.firestore.collection('routes').add(this.route)
      .then(() => {
        this.presentAlert('Successfully','Route added successfully');
        // Reset form after submission
        this.route = { from: '', to: '', amount: 0 };
      })
      .catch(error => {
        this.presentAlert('Error','add route was  unsuccessfully');
        console.error('Error adding route: ', error);
      });
  }

  getTransactions() {
    this.firestore.collection<Transaction>('transactions').snapshotChanges().subscribe(async (res) => {
    
      this.cards[2].count = res.length;

      this.transactions = await Promise.all(
        res.map(async (e) => {
          const data = e.payload.doc.data() as Transaction;
          const id = e.payload.doc.id;
  
          const passengerEmail = await this.getPassengerEmail(data.passengerId);

          const vehicleEmail = await this.getVehicleEmail(data.VehicleId);
  
          return { id, ...data, passengerEmail, vehicleEmail };
        })
      );
    });
  }
  
  // Method to fetch passenger email by passengerId
  async getPassengerEmail(passengerId: string): Promise<string> {
    const passengerDoc = await this.firestore.collection('passengers').doc(passengerId).get().toPromise();
    if (passengerDoc && passengerDoc.exists) {
      const passengerData = passengerDoc.data() as passenger;
      return passengerData?. passengerEmail|| ''; // Return email or empty string if not found
    }
    return '';
  }
  
  // Method to fetch vehicle owner email by vehicleId
  async getVehicleEmail(vehicleId: string): Promise<string> {
    const vehicleDoc = await this.firestore.collection('vehicles').doc(vehicleId).get().toPromise();
    if ( vehicleDoc && vehicleDoc.exists) {
      const vehicleData = vehicleDoc.data() as Vehicle;
      return vehicleData?.email || ''; // Return email or empty string if not found
    }
    return '';
  }
  


  getRoutes() {
    this.firestore.collection<Route>('routes').snapshotChanges().subscribe(res => {
      this.cards[3].count = res.length;
      this.routes = res.map(e => {
        const data = e.payload.doc.data() as Route;
        const id = e.payload.doc.id;
        
        return { id, ...data }; // Optionally include the document ID
      });
    });
  }
  



  onViewDetails(transaction: any) {
    // Implement view details logic
    console.log('View details', transaction);
  }





  

 

  toggleDiv(index: number) {
    // Toggle the div corresponding to the clicked button
    this.showDiv[index] = !this.showDiv[index];
  }
  onUpdate(item: any) {
    alert('Update button clicked for:'+item);
    // Your update logic here
  }

  onDelete(item: any) {
    alert('Delete button clicked for:'+ item);
    // Your delete logic here
  }
}



















 




import { search } from 'ionicons/icons';
import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar, 
  IonItem, 
  IonLabel, 
  IonAvatar, 
  IonList, 
  IonButton, 
  IonButtons, 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonProgressBar, 
  IonAlert, 
  IonToast 
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    IonToast, 
    IonAlert, 
    IonProgressBar, 
    IonCol, 
    IonRow, 
    IonGrid, 
    IonButtons, 
    IonButton, 
    IonList, 
    IonAvatar, 
    IonLabel, 
    IonItem, 
    IonSearchbar,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    CommonModule,
    FormsModule
  ],
})
export class Tab2Page {
  searchTerm: string = '';
  filteredUsers: any[] = [];
  isLoading: boolean = false;

  constructor(private firestore: Firestore, private router: Router) {}

  async searchUsers() {
    this.isLoading = true;
    if (this.searchTerm.trim() === '') {
      this.filteredUsers = [];
      this.isLoading = false;
      return;
    }

    const usersRef = collection(this.firestore, 'users');

    const q = query(
      usersRef,
      where('userName', '>=', this.searchTerm),
      where('userName', '<=', this.searchTerm + '\uf8ff')
    );

    const querySnapshot = await getDocs(q);

    this.filteredUsers = [];
    querySnapshot.forEach(doc => {
      this.filteredUsers.push({ id: doc.id, ...doc.data() });
    });

    this.isLoading = false;
  }

  navigateToUser(uid: string) {
    this.router.navigate(['/user', uid]);
  }
}

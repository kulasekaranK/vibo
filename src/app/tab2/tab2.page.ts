import { search } from 'ionicons/icons';
import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar, IonItem, IonLabel, IonAvatar, IonList, IonButton, IonButtons } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonButtons, IonButton, IonList, IonAvatar, IonLabel, IonItem, 
    IonSearchbar,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    ExploreContainerComponent,
    CommonModule,
    FormsModule
  ],
})
export class Tab2Page {
  searchTerm: string = '';
  filteredUsers: any[] = [];

  constructor(private firestore: Firestore) {}

  async searchUsers() {
    if (this.searchTerm.trim() === '') {
      this.filteredUsers = [];
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
  }


}
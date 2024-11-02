import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButton, IonButtons, IonFooter, IonList, IonItem, IonLabel, IonNote } from '@ionic/angular/standalone';
import { TabsPage } from "../tabs/tabs.page";
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
  standalone: true,
  imports: [IonNote, IonLabel,
    IonItem, IonList, IonFooter, IonButtons, IonButton, IonBackButton, IonContent, IonHeader, IonTitle, IonToolbar,
    CommonModule, FormsModule, TabsPage,
  ]
})
export class NotificationPage implements OnInit {
  notifications$: Observable<any[]> | undefined;

  constructor(private firestore: Firestore) { }

  ngOnInit() {
    const collectionRef = collection(this.firestore, 'Notifications');

    this.notifications$ = collectionData(collectionRef, { idField: 'id' });
    this.notifications$.subscribe((val)=>{

    })

  }
}

import { Component, EnvironmentInjector, inject, OnInit } from '@angular/core';  
import {  
  IonTabs,  
  IonTabBar,  
  IonTabButton,  
  IonIcon,  
  IonLabel,  
  AlertController,  
} from '@ionic/angular/standalone';  
import { addIcons } from 'ionicons';  
import {  
  triangle,  
  ellipse,  
  square,  
  home,  
  searchCircle,  
  search,  
  addCircle,  
  person,  
} from 'ionicons/icons';  
import { PushNotifications, PushNotificationSchema } from '@capacitor/push-notifications';  

import { Router } from '@angular/router';  
import { FirebaseService } from '../services/firebase.service';  
  
@Component({  
  selector: 'app-tabs',  
  templateUrl: 'tabs.page.html',  
  styleUrls: ['tabs.page.scss'],  
  standalone: true,  
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],  
})  
export class TabsPage implements OnInit {  
  public environmentInjector = inject(EnvironmentInjector);  
  
  constructor(private alertController: AlertController, private router: Router, private firebaseService: FirebaseService) {  
   addIcons({  
    home,  
    search,  
    addCircle,  
    person,  
    square,  
    searchCircle,  
    ellipse,  
    triangle,  
   });  
  }  
  
  ngOnInit(): void {  
   PushNotifications.requestPermissions().then((result) => {  
    if (result.receive === 'granted') {  
      PushNotifications.register();  
    } else {  
      this.showAlert('Permission Denied', 'Push notification permission was denied.');  
    }  
   });  
  
   PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {  
    this.storeNotification(notification);  
   });  
  

   PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {  
    this.showAlert(notification.title!, notification.body!);  
    this.storeNotification(notification);  
   });  
  }  

  
  private async showAlert(header: string, message: string) {  
   const alert = await this.alertController.create({  
    header: header,  
    message: message,  
    buttons: ['OK'],  
   });  
   await alert.present();  
  }  
  
  private storeNotification(notification: PushNotificationSchema) {  
   const notificationData = {  
    title: notification.title || 'No Title',  
    body: notification.body || 'No Body',  
    timestamp: new Date().toISOString(),  
   };  
   this.firebaseService.StoreNotification(notificationData);  
  }  
}
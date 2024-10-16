import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonButton,
  IonItem,
  IonList,
  IonInput,
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { ToastController} from '@ionic/angular'
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonInput,
    RouterLink,
    IonList,
    IonItem,
    IonButton,
    IonLabel,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class RegisterPage implements OnInit {
  name = '';
  email = '';
  password = '';
  phone = '';
  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private toastController: ToastController,
  ) {}

  async register() {
    try {
     const userCredential = await this.firebaseService.createUser(this.email, this.password);
     const uid = userCredential.user?.uid;
     await this.firebaseService.storeUserDetails(this.name, this.phone, this.email, uid)
      this.router.navigate(['/login']);
    } catch {
      const toast = this.toastController.create({
        message: 'Enter Valid Details!',
        duration: 5000,
        position: 'top',
      });
      (await toast).present();
    }
  }

  ngOnInit() {}
}

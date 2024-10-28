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
      const user = userCredential.user; 
      const uid = user?.uid;

      await this.firebaseService.storeUserDetails(this.name, this.phone, this.email, uid);

      await this.firebaseService.sendVerificationEmail(user);

      
      const toast = await this.toastController.create({
        message: 'A verification email has been sent to your email. Please verify and then login.',
        duration: 5000,
        position: 'top',
      });
      await toast.present();

      this.router.navigate(['/login']);
    } catch (error) {
      const toast = await this.toastController.create({
        message: 'Error: ' + (error || 'Enter Valid Details!'),
        duration: 5000,
        position: 'top',
      });
      await toast.present();
    }
  }

  ngOnInit() {}
}


import { Message } from './../../../node_modules/protobufjs/index.d';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonList,
  IonImg,
  IonInput,
  IonInputPasswordToggle,
  IonLabel,
  IonButton,
  IonButtons,
  IonToast,
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonToast,
    IonButtons,
    RouterLink,
    IonButton,
    IonLabel,
    IonInput,
    IonImg,
    IonList,
    IonItem,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonInputPasswordToggle,
  ],
})
export class LoginPage implements OnInit {
  email = '';
  password = '';

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private toastController: ToastController,
  ) {}

  async login() {
    try {
      const userCredential = await this.firebaseService.loginUser(this.email, this.password);
      const user = userCredential.user;

 
      await this.firebaseService.reloadUser(user);


      if (this.firebaseService.isEmailVerified(user)) {
       
        this.router.navigate(['/'], { replaceUrl: true });
      } else {

        const toast = await this.toastController.create({
          message: 'Please verify your email before logging in.',
          duration: 5000,
          position: 'top',
        });
        await toast.present();
      }
    } catch (error) {
      const toast = await this.toastController.create({
        message: 'Login failed: ' + ('Invalid credentials!'),
        duration: 5000,
        position: 'top',
      });
      await toast.present();
    }
  }

  ngOnInit() {}
}


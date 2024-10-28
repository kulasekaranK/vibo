import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonItem, IonLabel, IonList, IonInput } from '@ionic/angular/standalone';
import { FirebaseService } from '../services/firebase.service';
import { ToastController } from '@ionic/angular';
import { sendPasswordResetEmail } from 'firebase/auth';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  imports: [IonInput, IonList, CommonModule, FormsModule, IonLabel, IonItem, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ForgotPasswordPage implements OnInit {
  email: string = '';

  constructor(private service: FirebaseService, private toastController: ToastController) {}

  ngOnInit() {}

  async send() {
    try {
      console.log(this.email);
      await this.service.sendResetLink(this.email);
      const toast = await this.toastController.create({
        message: 'Password reset link sent successfully, please check your inbox!',
        duration: 5000,
        position: 'top',
        mode: 'ios',
      });
      toast.present();
    } catch {
      const toast = await this.toastController.create({
        message: 'Error sending password reset link!',
        duration: 5000,
        position: 'top',
        mode: 'ios',
      });
      toast.present();
    }
  }
}

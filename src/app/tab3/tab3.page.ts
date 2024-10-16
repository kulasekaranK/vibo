import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Firestore } from '@angular/fire/firestore';
import { Storage } from '@angular/fire/storage';
import { FirebaseService } from './../services/firebase.service';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonButton,
  IonInput,
  IonList,
  IonItem,
  IonFooter,
  IonNote,
  IonToast,
  IonFab,
  IonFabButton,
  IonIcon,
  IonLabel, IonText, IonButtons } from '@ionic/angular/standalone';
import { addDoc, collection } from 'firebase/firestore';
import { ToastController, LoadingController } from '@ionic/angular';
import { getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { addIcons } from 'ionicons';
import { camera } from 'ionicons/icons';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonButtons, IonText, 
    IonLabel,
    IonHeader,
    IonIcon,
    IonFabButton,
    IonFab,
    IonToast,
    IonNote,
    IonFooter,
    FormsModule,
    CommonModule,
    IonItem,
    IonList,
    IonInput,
    IonButton,
    IonCard,
    IonLabel,
    IonToolbar,
    IonTitle,
    IonContent,
  ],
})
export class Tab3Page implements OnInit {
  selectedFile: File | null = null; 
  caption = '';
  location = '';
  userDetails: any = null;
  imagePreview: string | null = null; 
  loading: HTMLIonLoadingElement | null = null;

  toastMessage: string = '';
  showToast: boolean = false;

  constructor(
    private FirebaseService: FirebaseService,
    private Firestore: Firestore,
    private storage: Storage,
    private toast: ToastController  ) {
    addIcons({ camera });
  }

  async ngOnInit() {
    const user = await this.FirebaseService.getCurrentUser();
    if (user) {
      this.userDetails = await this.FirebaseService.loadUserDetail(user.uid);
    }
    console.log(this.userDetails);
  }

  async uploadFile(event: any) {
    const input = event.target as HTMLInputElement;

    if (input && input.files && input.files.length > 0) {
      const file = input.files[0];

      if (file.type.startsWith('image/')) {
        this.selectedFile = file;
        const reader = new FileReader();
        reader.onload = () => {
          console.log(reader.result as string);
          
          this.imagePreview = reader.result as string;
        };
        reader.readAsDataURL(file);

        this.toastMessage = 'Image uploaded successfully';
        this.showToast = true;
      } else {
        console.error('Selected file is not an image');
        this.imagePreview = null;
        this.selectedFile = null;
        this.toastMessage = 'Please select a valid image file';
        this.showToast = true;
      }
    } else {
      console.error('No file selected');
      this.toastMessage = 'No file selected. Please choose an image.';
      this.showToast = true;
    }
  }

  async takePhoto() {  
    try {  
      const image = await Camera.getPhoto({  
        resultType: CameraResultType.DataUrl,  
        source: CameraSource.Camera,  
        quality: 100,  
      });  
      this.imagePreview = image.dataUrl!;  
      console.log(this.imagePreview);
      
    } catch (error) {  
      console.error('Error capturing photo:', error);  
      this.toastMessage = 'Error capturing photo';
      this.showToast = true;  
    }  
  }

  async createPost(postForm: any) {
    try {
      if (this.imagePreview) {
        const storageRef = ref(this.storage, `posts/${new Date().getTime()}_photo.jpg`);
        const response = await fetch(this.imagePreview);
        console.log(response);
        
        const blob = await response.blob();
        console.log(blob);
        
        await uploadBytes(storageRef, blob);
  
        const postLink = await getDownloadURL(storageRef);
        const collectionRef = collection(this.Firestore, 'posts');
  
        await addDoc(collectionRef, {
          postLink: postLink,
          caption: this.caption,
          location: this.location,
          uid: this.userDetails.uid,
          likes: 0,
          comments: 0,
        });

        postForm.resetForm();
        this.caption = '';
        this.location = '';
        this.imagePreview = null;
        this.selectedFile = null;

        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
        
        this.toastMessage = 'Post Created Successfully! 🎉';
        this.showToast = true;
      } else {
        this.toastMessage = 'Please select an image to upload';
        this.showToast = true;
      }
    } catch (err) {
      console.log(err);
      this.toastMessage = 'Oops! 😞 Something went wrong while creating your post.';
      this.showToast = true;
    }
  }

}

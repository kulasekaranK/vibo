import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
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
  IonLabel, 
  IonText, 
  IonButtons, 
  IonLoading
} from '@ionic/angular/standalone';
import { addDoc, collection } from 'firebase/firestore';
import { ToastController, LoadingController } from '@ionic/angular';
import { getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { addIcons } from 'ionicons';
import { camera, locationOutline } from 'ionicons/icons';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [
    IonLoading, 
    IonButtons, 
    IonText, 
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
  @ViewChild('postForm') postForm!: NgForm;
  selectedFile: File | null = null; 
  caption = '';
  location = '';
  userDetails: any = null;
  imagePreview: string | null = null; 
  loading: HTMLIonLoadingElement | null = null;
  toastMessage: string = '';
  showToast: boolean = false;
  locationIqApiKey: string = 'pk.3a64257817134495e1b09946c4d2d0a4';
  locationSuggestions: any[] = [];

  constructor(
    private FirebaseService: FirebaseService,
    private Firestore: Firestore,
    private storage: Storage,
    private toast: ToastController,
    private loadingController: LoadingController,
    private http: HttpClient,
  ) {
    addIcons({ locationOutline, camera });
  }

  
  async presentLoader() {
    const loading = await this.loadingController.create({
      message: 'Posting',
      spinner: 'lines-sharp',
      mode: 'ios',
    });
    await loading.present();
    return loading;
  }

  async dismissLoader(loading: any) {
    await loading.dismiss();
  }

  
  async ngOnInit() {
    const user = await this.FirebaseService.getCurrentUser();
    if (user) {
      this.userDetails = await this.FirebaseService.loadUserDetail(user.uid);
    }
    console.log(this.userDetails);
  }

  
  cancel() {
    this.imagePreview = null;
    this.selectedFile = null;
    this.postForm.reset();
  }

  
  getLocationSuggestions() {
    const input = this.location;
    console.log(input);
    if (input && input.trim() !== '') {
      const url = `https://us1.locationiq.com/v1/search.php?key=${this.locationIqApiKey}&q=${input}&format=json&limit=5`;
      this.http.get(url).subscribe((response: any) => {
        this.locationSuggestions = response;
      });
    } else if (input === '') {
      this.locationSuggestions = [];
    }
  }

  
  selectedLocation(location: any) {
    this.location = location.display_name;
    this.locationSuggestions = [];
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
      const loading = await this.presentLoader();
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
      await this.dismissLoader(loading);
    } catch (err) {
      console.log(err);
      this.toastMessage = 'Oops! 😞 Something went wrong while creating your post.';
      this.showToast = true;
    }
  }
}

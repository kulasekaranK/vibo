import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonItem,
  IonAvatar,
  IonIcon,
  IonModal,
  IonInput,
  IonButton,
  IonFooter,
  IonFabButton,
  IonText,
  IonTextarea,
  IonSegment,
  IonSegmentButton,
  IonList,
  IonNote,
  IonButtons,
  IonRefresher,
  IonRefresherContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonImg, IonCardContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { home, pencilOutline, logOut, power, heartCircleOutline, location, heartOutline, chatbubbleOutline, bookmarkOutline, heart, sendOutline } from 'ionicons/icons';
import { FirebaseService } from '../services/firebase.service';
import { getDownloadURL, Storage, uploadBytes } from '@angular/fire/storage';
import { ref } from 'firebase/storage';
import { Firestore } from '@angular/fire/firestore';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: true,
  imports: [IonCardContent, IonImg, IonCardHeader, IonCard, IonCol, IonRow, IonGrid, 
    IonRefresherContent,
    IonRefresher,
    IonButtons,
    IonNote,
    IonList,
    IonSegmentButton,
    IonSegment,
    IonTextarea,
    IonText,
    IonFabButton,
    IonFooter,
    IonButton,
    IonInput,
    FormsModule,
    CommonModule,
    IonModal,
    IonIcon,
    IonAvatar,
    IonItem,
    IonLabel,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
  providers: [ModalController],
})
export class Tab4Page implements OnInit {
  userDetails: any = null;
  editableUserDetails: any = {
    username: '',
    name: '',
    profilePic: '',
    bio: '',
  };
  selectedFile: File | null = null;
  userName = '';
  segmentValue: string = 'Your-Posts';
  ThisUserPosts:any = null;
  savedPost:any;
  selectedPost: any;
  isModalOpen: boolean = false;
  postComments: any[] | null = null;
  comments: any;

  constructor(
    private modalController: ModalController,
    private firebaseService: FirebaseService,
    private storage: Storage,
    private firestore: Firestore
  ) {
    addIcons({power,pencilOutline,heart,chatbubbleOutline,sendOutline,location,heartOutline,bookmarkOutline,heartCircleOutline,logOut});
  }
  doRefresh(event: any) {
    setTimeout(async () => {
      await this.ngOnInit();
      event.target.complete();
    }, 3000);
  }

  async ngOnInit() {
    const user = await this.firebaseService.getCurrentUser();
    if (user) {
      this.userDetails = await this.firebaseService.loadUserDetail(user.uid);
      this.editableUserDetails.name = this.userDetails.name;
      this.editableUserDetails.username = this.userDetails.userName;
      this.editableUserDetails.bio = this.userDetails.bio;
      this.userName = `@ ${this.userDetails.userName}`;
      this.ThisUserPosts = await this.firebaseService.loadSeparateUsersPost(user.uid);
      console.log(this.ThisUserPosts);
   this.savedPost = await this.firebaseService.loadSavedPost(user.uid);
   console.log(this.savedPost);
   
 
    }
  }
  uploadFile(event: any) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
  }

  async updateProfile() {
    const user = await this.firebaseService.getCurrentUser();
    if (user) {
      const uid = user.uid;

      if (this.selectedFile) {
        const storageRef = ref(this.storage, `profile-picture/${uid}`);
        await uploadBytes(storageRef, this.selectedFile);
        const downloadUrl = await getDownloadURL(storageRef);
        this.editableUserDetails.profilePic = downloadUrl;
      } else {
        this.editableUserDetails.profilePic = this.userDetails.profilePic;
      }

      const collectionRef = collection(this.firestore, 'users');
      const q = query(collectionRef, where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, {
        name: this.editableUserDetails.name,
        userName: this.editableUserDetails.username,
        bio: this.editableUserDetails.bio,
        profilePic: this.editableUserDetails.profilePic,
      });

      console.log('Profile updated!');
      await this.dismissModal();
      await this.ngOnInit();
    }
  }
  async dismissModal() {
    await this.modalController.dismiss();
  }
  segmentChange(event: any) {
    this.segmentValue = event.detail.value;
    console.log(event.detail.value);
    
  }
  async openCommentModal(post: any) {
    this.selectedPost = post;
    this.isModalOpen = true;
    this.firebaseService.loadComments(post);
    this.firebaseService.comments$.subscribe((comments) => {
      this.postComments = comments;
    });
  }
  closeModal() {
    this.isModalOpen = false;
    this.selectedPost = null;
    this.postComments = [];
  }
  async addComment(postId: string) {
    const user = await this.firebaseService.getCurrentUser();
    if (user) {
      this.firebaseService.postComment(user.uid, postId, this.comments);
      this.comments = '';
    }
    this.firebaseService.loadComments('WatLSeuNfbKPph5gsqN4');
  }
  logout(){
    this.firebaseService.logout();
  }

}

import { FirebaseService } from './../services/firebase.service';
import { Firestore } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonCard,
  IonCardHeader,
  IonLabel,
  IonAvatar,
  IonItem,
  IonCardContent,
  IonImg,
  IonIcon,
  IonNote,
  IonText,
  IonButtons,
  IonButton,
  IonModal,
  IonFooter,
  IonInput,
  IonRefresher,
  IonRefresherContent, IonCol, IonGrid, IonRow } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import {
  home,
  heartOutline,
  chatbubblesOutline,
  chatbubbleOutline,
  bookmarkOutline,
  notificationsOutline,
  sendOutline,
  location,
  logoGithub,
} from 'ionicons/icons';
import { collection, query, where } from 'firebase/firestore';
import {ToastController} from '@ionic/angular'

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonRow, IonGrid, IonCol, 
    IonRefresherContent,
    IonRefresher,
    IonInput,
    IonFooter,
    IonModal,
    IonButton,
    IonButtons,
    IonText,
    IonNote,
    IonIcon,
    IonImg,
    IonCardContent,
    IonItem,
    IonAvatar,
    IonLabel,
    IonCardHeader,
    CommonModule,
    FormsModule,
    IonCard,
    IonList,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    ExploreContainerComponent,
  ],
})
export class Tab1Page implements OnInit {
  posts: any[] | null = null;
  comments = '';
  userDetails: any | null = null;
  postComments: any[] | null = null;
  selectedPost: any = null;
  isModalOpen = false;
  userLikes: boolean = false;

  constructor(
    private firebaseService: FirebaseService,
    private firestore: Firestore,
    private toast: ToastController,
  ) {
    addIcons({
      notificationsOutline,
      location,
      heartOutline,
      chatbubbleOutline,
      sendOutline,
      bookmarkOutline,
      chatbubblesOutline,
    });
  }
  async ngOnInit() {
    await this.firebaseService.loadPost();
    this.firebaseService.posts$.subscribe(async (posts) => {
      this.posts = posts;
      for (const post of this.posts) {
        post.userLikes = await this.firebaseService.userLikeThisPost(post.id);
        console.log(post);
      }
    });
  }

  doRefresh(event: any) {
    setTimeout(async () => {
      await this.ngOnInit();
      event.target.complete();
    }, 3000);
  }
  async openCommentModal(post: any) {
    this.selectedPost = post;
    this.isModalOpen = true;
    this.firebaseService.loadComments(post.id);
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

  async onLikePost(postId: string) {
    const user = await this.firebaseService.getCurrentUser();
    if (user) {
      await this.firebaseService.likePost(postId, user.uid);
    } else {
      console.log('User must be logged in to like a post.');
    }
  }
   async savePost(PostId:string){
    const user = await this.firebaseService.getCurrentUser();
    if(user){
      this.firebaseService.savePost(user.uid, PostId);
    const toast = await this.toast.create({
      message:"Post Saved",
      duration:3000,
      position:'top',

    });
    toast.present();
    }


   }
}

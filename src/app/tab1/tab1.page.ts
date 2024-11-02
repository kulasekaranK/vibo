import { FirebaseService } from './../services/firebase.service';
import { Firestore } from '@angular/fire/firestore';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
  IonRefresherContent,
  IonCol,
  IonGrid,
  IonRow,
  IonSkeletonText,
} from '@ionic/angular/standalone';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
  close,
  heart,
} from 'ionicons/icons';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { ToastController } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonSkeletonText,
    IonRow,
    IonGrid,
    IonCol,
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
    RouterLink,
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
  loading: boolean = true;
  followers: any[] = [];
  followSuggestionsList: any[] = [];

  constructor(
    private firebaseService: FirebaseService,
    private firestore: Firestore,
    private toast: ToastController,
    private router: Router
  ) {
    addIcons({
      notificationsOutline,
      location,
      heartOutline,
      heart,
      chatbubbleOutline,
      bookmarkOutline,
      close,
      sendOutline,
      chatbubblesOutline,
    });
  }

  loadSuggestions() {
    const collectionRef = collection(this.firestore, 'users');
    onSnapshot(collectionRef, async (snapshot) => {
      this.followSuggestionsList = snapshot.docs.map((doc) => doc.data());
    });
  }

  async ngOnInit() {
    this.loading = true;
    this.loadSuggestions();

    const user = await this.firebaseService.getCurrentUser();
    if (user) {
      this.userDetails = await this.firebaseService.loadUserDetail(user.uid);
      if (this.userDetails.following) {
        this.followers = await this.loadFollowerDetails(
          this.userDetails.following
        );
      }
    }

    await this.firebaseService.loadPost();
    this.firebaseService.posts$.subscribe(async (posts) => {
      this.posts = posts;
      this.loading = false;
      for (const post of this.posts) {
        post.userLikes = await this.firebaseService.userLikeThisPost(post.id);
        post.isFollowing = await this.firebaseService.isFollowing(post.uid);
      }
    });
  }

  trackPostById(index: number, post: any): string {
    return post.id;
  }

  async followUser(uid: string, post: any, ev: Event) {
    ev.stopPropagation();
    await this.firebaseService.followUser(uid);
    post.isFollowing = !post.isFollowing;
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
    this.firebaseService.loadComments(postId);
  }

  async onToggleLikePost(postId: string, ev: Event) {
    ev.preventDefault();
    ev.stopImmediatePropagation();
    const user = await this.userDetails.uid;

    if (user) {
      await this.firebaseService.toggleLikePost(postId, user);
    } else {
      console.log('User must be logged in to like or unlike a post.');
    }
  }

  async savePost(postId: string) {
    const user = await this.firebaseService.getCurrentUser();
    if (user) {
      this.firebaseService.savePost(user.uid, postId);
      const toast = await this.toast.create({
        message: 'Post Saved',
        duration: 3000,
        position: 'top',
      });
      toast.present();
    }
  }

  navigateToUser(uid: string) {
    this.router.navigate(['/user', uid]);
  }

  async loadFollowerDetails(followerIds: string[]): Promise<any[]> {
    const followerDetails: any[] = [];
    for (const followerId of followerIds) {
      const follower = await this.firebaseService.loadUserDetail(followerId);
      if (follower) {
        followerDetails.push(follower);
      }
    }
    return followerDetails;
  }
}

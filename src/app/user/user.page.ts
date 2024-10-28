import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonModal,
  IonRow,
  IonGrid,
  IonCard,
  IonCol,
  IonImg,
  IonBadge,
  IonFooter,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonButtons,
  IonButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonNote,
  IonInput,
  IonText,
  IonRefresher,
  IonRefresherContent,
  IonRippleEffect,
  IonBackButton, IonLoading } from '@ionic/angular/standalone';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { addIcons } from 'ionicons';
import {
  heart,
  chatbubbleOutline,
  sendOutline,
  heartOutline,
} from 'ionicons/icons';
import {LoadingController} from '@ionic/angular'

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
  standalone: true,
  imports: [IonLoading, 
    IonBackButton,
    IonRippleEffect,
    IonRefresherContent,
    IonRefresher,
    IonText,
    IonInput,
    IonNote,
    IonSegmentButton,
    IonSegment,
    IonIcon,
    IonButton,
    IonButtons,
    IonLabel,
    IonAvatar,
    IonItem,
    IonList,
    IonFooter,
    IonBadge,
    IonImg,
    IonCol,
    IonCard,
    IonGrid,
    IonRow,
    IonModal,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    RouterLink
  ],
})
export class UserPage implements OnInit {
  userDetails: any = null;
  userName = '';
  isFollowing = false;
  ThisUserPosts: any[] = [];
  selectedPost: any;
  isModalOpen: boolean = false;
  postComments: any[] | null = null;
  comments: any;
  userLikes: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private firebaseService: FirebaseService,
    private loadingController:LoadingController,
    private router: Router,
  ) {
    addIcons({ heartOutline, chatbubbleOutline, sendOutline, heart });
  }
  async presentLoader() {
    const loading = await this.loadingController.create({
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
    const loading = await this.presentLoader();
    const uid = this.route.snapshot.paramMap.get('uid');
    console.log(uid);

    if (uid) {
      this.userDetails = await this.firebaseService.loadUserDetail(uid);
      this.userName = `@${this.userDetails.userName}`;
      this.isFollowing = await this.firebaseService.isFollowing(uid);

      const posts = await this.firebaseService.loadSeparateUsersPost(uid);
      this.ThisUserPosts = posts ? posts : [];

      for (const post of this.ThisUserPosts) {
        post.userLikes = await this.firebaseService.userLikeThisPost(post.id);
        console.log(post);
      }
    }
    await this.dismissLoader(loading);
  }

  doRefresh(event: any) {
    setTimeout(async () => {
      await this.ngOnInit();
      event.target.complete();
    }, 3000);
  }
  async followUser(uid: string) {
    await this.firebaseService.followUser(uid);
    this.ngOnInit();
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
  async onLikePost(postId: string) {
    const user = await this.firebaseService.getCurrentUser();
    if (user) {
      await this.firebaseService.likePost(postId, user.uid);
    } else {
      console.log('User must be logged in to like a post.');
    }
  }
  navigateChat(uid:string){
   console.log(uid);
   this.router.navigate(['/conversation',uid])
   
  }
}

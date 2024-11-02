import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonBackButton,
  IonAvatar,
  IonNote,
  IonLabel,
  IonFooter,
  IonInput,
  IonItem,
  IonIcon,
  IonList,
  IonBadge,
  IonProgressBar,
  IonText,
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { addIcons } from 'ionicons';
import {
  atOutline,
  personSharp,
  sendOutline,
  ellipsisVerticalOutline,
} from 'ionicons/icons';
import {
  Database,
  onValue,
  push,
  ref,
  serverTimestamp,
  set,
} from '@angular/fire/database';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.page.html',
  styleUrls: ['./conversation.page.scss'],
  standalone: true,
  imports: [
    IonText,
    IonProgressBar,
    IonBadge,
    IonList,
    IonIcon,
    IonItem,
    IonInput,
    IonFooter,
    IonLabel,
    IonNote,
    IonAvatar,
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    FormsModule,
    CommonModule,
  ],
})
export class ConversationPage implements OnInit {
  userDetails: any = null;
  userName: string = '';
  currentUserDetails: any = null;
  newMessage: string = '';
  messages: any[] = [];
  private lastSentMessageKey: string | null = null;
  constructor(
    private route: ActivatedRoute,
    private firebaseService: FirebaseService,
    private database: Database,
    private router: Router
  ) {
    addIcons({ personSharp, ellipsisVerticalOutline, sendOutline });
  }

  async ngOnInit() {
    const uid = this.route.snapshot.paramMap.get('uid');
    if (uid) {
      this.userDetails = await this.firebaseService.loadUserDetail(uid);
      this.userName = `@${this.userDetails.userName}`;
    }
    const currentUser = await this.firebaseService.getCurrentUser();
    if (currentUser) {
      this.currentUserDetails = await this.firebaseService.loadUserDetail(
        currentUser.uid
      );
    }

    if (this.currentUserDetails && uid) {
      this.loadMessages(this.currentUserDetails.uid, uid);
    }
  }

  loadMessages(currentUserId: string, otherUserId: string) {
    const chatId = this.getChatId(currentUserId, otherUserId);

    const messagesRef = ref(this.database, `chats/${chatId}/messages`);

    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      this.messages = data ? Object.values(data) : [];
    });
  }

  async sendMessage() {
    if (!this.newMessage.trim()) return;

    const senderName = this.currentUserDetails.name;
    const senderAvatar = this.currentUserDetails.profilePic;

    const currentUserId = this.currentUserDetails.uid;
    const otherUserId = this.userDetails.uid;
    const chatId = this.getChatId(currentUserId, otherUserId);

    const messagesRef = ref(this.database, `chats/${chatId}/messages`);

    // Push a new message
    const newMessageRef = push(messagesRef);
    await set(newMessageRef, {
      senderId: currentUserId,
      receiverId: otherUserId,
      senderName: senderName,
      senderAvatar: senderAvatar,
      text: this.newMessage,
      timestamp: serverTimestamp(),
      read: false,
    });

    this.lastSentMessageKey = newMessageRef.key;

    this.newMessage = '';
  }

  getChatId(uid1: string, uid2: string): string {
    return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
  }
}

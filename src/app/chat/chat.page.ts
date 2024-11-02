import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonNote,
  IonSearchbar,
  IonBadge,
  IonText,
} from '@ionic/angular/standalone';
import { FirebaseService } from '../services/firebase.service';
import { onValue, ref, update } from 'firebase/database';
import { Router } from '@angular/router';
import { Database } from '@angular/fire/database';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [
    IonText,
    IonBadge,
    IonNote,
    IonLabel,
    IonAvatar,
    IonItem,
    IonList,
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSearchbar,
    CommonModule,
    FormsModule,
  ],
})
export class ChatPage implements OnInit {
  currentUserId: string = '';
  chatList: any[] = [];
  filteredChatList: any[] = [];
  searchQuery: string = '';
  currentUserDetails: any;

  constructor(
    private firebaseService: FirebaseService,
    private database: Database,
    private router: Router
  ) {}

  async ngOnInit() {
    const currentUser = await this.firebaseService.getCurrentUser();
    if (currentUser) {
      this.currentUserDetails = await this.firebaseService.loadUserDetail(
        currentUser.uid
      );
      this.currentUserId = currentUser.uid;
      this.loadChatList(this.currentUserId);
    }
  }

  async loadChatList(userId: string) {
    const chatsRef = ref(this.database, `chats`);

    onValue(chatsRef, async (snapshot) => {
      const data = snapshot.val();
      const chatMap: { [key: string]: any } = {};
      this.chatList = [];

      if (data) {
        for (const chatId in data) {
          const chat = data[chatId];
          if (chat.messages) {
            const messages = Object.values(chat.messages);
            const lastMessage: any = messages.pop();

            const receiverId =
              lastMessage.senderId === userId
                ? lastMessage.receiverId
                : lastMessage.senderId;

            const receiverDetails = await this.firebaseService.loadUserDetail(
              receiverId
            );

            const newMessages =
              lastMessage.receiverId === userId && !lastMessage.read;

            if (!chatMap[receiverId]) {
              chatMap[receiverId] = {
                chatId,
                receiverName: receiverDetails.name,
                receiverId,
                receiverAvatar: receiverDetails.profilePic,
                text: lastMessage.text,
                timestamp: lastMessage.timestamp,
                newMessages,
              };
            } else {
              chatMap[receiverId].text = lastMessage.text;
              chatMap[receiverId].timestamp = lastMessage.timestamp;
              chatMap[receiverId].newMessages =
                chatMap[receiverId].newMessages || newMessages;
            }
          }
        }
      }
      this.chatList = Object.values(chatMap);

      this.filteredChatList = this.chatList;
    });
  }

  openChat(uid: string, chatId: any) {
    this.updateReadStatus(chatId);
    this.router.navigate(['/conversation', uid]);
  }

  async updateReadStatus(chatId: string) {
    const messagesRef = ref(this.database, `chats/${chatId}/messages`);
    onValue(messagesRef, async (snapshot) => {
      const messages = snapshot.val();

      if (messages) {
        const messageKeys = Object.keys(messages);
        const lastMessageKey = messageKeys[messageKeys.length - 1];
        const lastMessage = messages[lastMessageKey];

        // Only update read status if it's not already true
        if (!lastMessage.read) {
          await update(
            ref(this.database, `chats/${chatId}/messages/${lastMessageKey}`),
            {
              read: true,
            }
          );
        }
      }
    });
  }

  filterChats() {
    this.filteredChatList = this.chatList.filter((chat) =>
      chat.receiverName.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}

import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  User,
} from '@angular/fire/auth';
import { addDoc, Firestore, collection,runTransaction } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import {
  arrayRemove,
  arrayUnion,
  doc,
  DocumentData,
  DocumentReference,
  FieldValue,
  getDoc,
  getDocs,
  increment,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private postsSubject = new BehaviorSubject<any[]>([]);
  posts$ = this.postsSubject.asObservable();

  private commentsSubject = new BehaviorSubject<any[]>([]);
  comments$ = this.commentsSubject.asObservable();

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {
    this.getCurrentUser();
  }

  createUser(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  loginUser(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async storeUserDetails(
    name: string,
    phoneNumber: string,
    email: string,
    uid: string
  ) {
    const collectionRef = collection(this.firestore, 'users');
    return await addDoc(collectionRef, {
      name,
      phoneNumber,
      email,
      uid,
      followersCount: 0,
      followingCount: 0,
      userName: name,
      profilePic:
        'https://media.istockphoto.com/id/1397556857/vector/avatar-13.jpg?s=612x612&w=0&k=20&c=n4kOY_OEVVIMkiCNOnFbCxM0yQBiKVea-ylQG62JErI=',
    });
  }

  getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }
        resolve(user);
      });
    });
  }

  async loadUserDetail(uid: string): Promise<any> {
    try {
      const collectionRef = collection(this.firestore, 'users');
      const q = query(collectionRef, where('uid', '==', uid));
      const snapshot = await getDocs(q);
      const userDetails = snapshot.docs.map((doc) => doc.data());
      return userDetails.length > 0 ? userDetails[0] : null;
    } catch (err) {
      console.error('Error loading user details:', err);
      return null;
    }
  }

  async loadPost(): Promise<void> {
    try {
      const collectionRef = collection(this.firestore, 'posts');
      onSnapshot(collectionRef, async (snapshot) => {
        const posts = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const postData = doc.data();
            const userDetails = await this.loadUserDetail(postData['uid']);
            return { id: doc.id, ...postData, ...userDetails };
          })
        );

        posts.sort((a, b) => {
          const dateA = a.createdAt?.toMillis() || 0;
          const dateB = b.createdAt?.toMillis() || 0;
          return dateB - dateA;
        });

        this.postsSubject.next(posts);
      });
    } catch (err) {
      console.error('Error loading posts:', err);
    }
  }

  async postComment(uid: string, postId: string, comment: string) {
    const collectionRef = collection(this.firestore, 'comments');
    return await addDoc(collectionRef, {
      uid: uid,
      postId: postId,
      comment: comment,
    });
  }

  async loadComments(postId: string) {
    try {
      const collectionRef = collection(this.firestore, 'comments');
      const q = query(collectionRef, where('postId', '==', postId));

      onSnapshot(q, async (snapshot) => {
        const comments = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const comment = doc.data();
            const userDetails = await this.loadUserDetail(comment['uid']);
            return { ...comment, ...userDetails };
          })
        );
        this.commentsSubject.next(comments);
      });
    } catch (err) {
      console.error('Error loading comments:', err);
    }
  }

  async loadSavedPost(uid: string) {
    const collectionRef = collection(this.firestore, 'savedPosts');
    const q = query(collectionRef, where('uid', '==', uid));
    const docSnap = await getDocs(q);

    const postsWithUserDetails = await Promise.all(
      docSnap.docs.map(async (savedDoc) => {
        const savedPost = savedDoc.data();
        const postId = savedPost['postId'];
        const postDocRef = doc(this.firestore, `posts/${postId}`);
        const postDocSnap = await getDoc(postDocRef);

        if (postDocSnap.exists()) {
          const postData = postDocSnap.data();

          const userUid = postData['uid'];

          const userDetail = await this.loadUserDetail(userUid);

          return { ...postData, ...userDetail };
        } else {
          console.log(`Post with ID ${postId} does not exist.`);
          return null;
        }
      })
    );

    return postsWithUserDetails.filter((post) => post !== null);
  }
  async toggleLikePost(postId: string, userId: string): Promise<void> {
    const postRef = doc(this.firestore, 'posts', postId);

    await runTransaction(this.firestore, async (transaction) => {
      const postSnap = await transaction.get(postRef);

      if (postSnap.exists()) {
        const postData = postSnap.data();
        const likedBy = postData['likedBy'] || [];
        const newLikesCount = likedBy.includes(userId) ? -1 : 1;

        transaction.update(postRef, {
          likes: increment(newLikesCount),
          likedBy: likedBy.includes(userId)
            ? arrayRemove(userId)
            : arrayUnion(userId),
        });

        this.updatePostInState(postId, {
          likes: postData['likes'] + newLikesCount,
          likedBy: likedBy.includes(userId)
            ? likedBy.filter((id: string) => id !== userId)
            : [...likedBy, userId],
        });
      } else {
        console.log('Post does not exist.');
      }
    });
  }

  private updatePostInState(postId: string, updatedData: any): void {
    const posts = this.postsSubject.getValue();
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return { ...post, ...updatedData };
      }
      return post;
    });
    this.postsSubject.next(updatedPosts);
  }

  async getPostLikes(postId: string): Promise<any> {
    const postRef = doc(this.firestore, 'posts', postId);
    const postSnap = await getDoc(postRef);
    return postSnap.data()?.['likes'] || 0;
  }
  async userLikeThisPost(postId: string): Promise<boolean> {
    const user = await this.getCurrentUser();
    if (user) {
      const postRef = doc(this.firestore, 'posts', postId);
      const postSnap = await getDoc(postRef);

      if (postSnap.exists()) {
        const postData = postSnap.data();
        const likedBy = postData['likedBy'] || [];
        return likedBy.includes(user.uid);
      }
    }
    return false;
  }

  async loadSeparateUsersPost(uid: string) {
    try {
      const collectionRef = collection(this.firestore, 'posts');
      const q = query(collectionRef, where('uid', '==', uid));
      const docSnap = await getDocs(q);

      const postsWithUserDetails = await Promise.all(
        docSnap.docs.map(async (postDoc) => {
          const postData = postDoc.data();

          const userUid = postData['uid'];
          const userDetail = await this.loadUserDetail(userUid);

          return { id: postDoc.id, ...postData, ...userDetail };
        })
      );

      return postsWithUserDetails;
    } catch (err) {
      console.error('Error loading posts:', err);
      return null;
    }
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login'], { replaceUrl: true });
    return this.auth.signOut();
  }
  async savePost(uid: string, postId: string) {
    const collectionRef = collection(this.firestore, 'savedPosts');
    return await addDoc(collectionRef, { uid: uid, postId: postId });
  }
  async StoreNotification(notification: any) {
    try {
      const collectionRef = collection(this.firestore, 'Notifications');
      await addDoc(collectionRef, {
        title: notification.title,
        message: notification.body,
        timestamp: notification.timestamp,
      });
      console.log('Notification stored successfully');
    } catch (error) {
      console.error('Error storing notification: ', error);
    }
  }

  async followUser(uid: string) {
    const currentUser = await this.getCurrentUser();

    if (!currentUser) {
      console.error('No current user found.');
      return;
    }
    const alreadyFollowing = await this.isFollowing(uid);

    const userCollectionRef = collection(this.firestore, 'users');
    const userQuery = query(userCollectionRef, where('uid', '==', uid));

    const userQuerySnapshot = await getDocs(userQuery);

    if (!userQuerySnapshot.empty) {
      const userDoc = userQuerySnapshot.docs[0];

      if (alreadyFollowing) {
        await updateDoc(userDoc.ref, {
          followersCount: increment(-1),
          followers: arrayRemove(currentUser.uid),
        });

        const currentUserQuery = query(
          userCollectionRef,
          where('uid', '==', currentUser.uid)
        );
        const currentUserQuerySnapshot = await getDocs(currentUserQuery);

        if (!currentUserQuerySnapshot.empty) {
          const currentUserDoc = currentUserQuerySnapshot.docs[0];

          await updateDoc(currentUserDoc.ref, {
            followingCount: increment(-1),
            following: arrayRemove(uid),
          });

          console.log('Successfully unfollowed the user.');
        }
      } else {
        await updateDoc(userDoc.ref, {
          followersCount: increment(1),
          followers: arrayUnion(currentUser.uid),
        });
        const currentUserQuery = query(
          userCollectionRef,
          where('uid', '==', currentUser.uid)
        );
        const currentUserQuerySnapshot = await getDocs(currentUserQuery);

        if (!currentUserQuerySnapshot.empty) {
          const currentUserDoc = currentUserQuerySnapshot.docs[0];

          await updateDoc(currentUserDoc.ref, {
            followingCount: increment(1),
            following: arrayUnion(uid),
          });

          console.log('Successfully followed the user.');
        }
      }
    }
  }

  async isFollowing(targetUid: string): Promise<boolean> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser || !currentUser.uid) return false;
    const querySnapshot = await getDocs(
      query(
        collection(this.firestore, 'users'),
        where('uid', '==', currentUser.uid)
      )
    );
    if (querySnapshot.empty) {
      console.error('Current user document not found.');
      return false;
    }
    const followingList = querySnapshot.docs[0].data()['following'] || [];
    return followingList.includes(targetUid);
  }
  async sendResetLink(email: string) {
    console.log(email);

    try {
      await sendPasswordResetEmail(this.auth, email);
      console.log('Password reset email sent!');
    } catch (error) {
      console.error('Error sending password reset email:', error);
    }
  }
  sendVerificationEmail(user: User) {
    return sendEmailVerification(user);
  }
  isEmailVerified(user: User): boolean {
    return user.emailVerified;
  }

  reloadUser(user: User) {
    return user.reload();
  }
}

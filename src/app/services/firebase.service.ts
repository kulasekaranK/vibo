import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  User,
} from '@angular/fire/auth';
import { addDoc, Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import {
  arrayUnion,
  collection,
  doc,
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
  
    return postsWithUserDetails.filter(post => post !== null);
  }
  
  
  
  
  async likePost(postId: string, userId: string): Promise<void> {
    const postRef = doc(this.firestore, 'posts', postId);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      const postData = postSnap.data();
      const likedBy = postData['likedBy'] || [];

      if (!likedBy.includes(userId)) {
        await updateDoc(postRef, {
          likes: increment(1),
          likedBy: arrayUnion(userId),
        });
      } else {
        console.log('User has already liked this post.');
      }
    } else {
      console.log('Post does not exist.');
    }
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
      const docSnap = getDocs(q);
      return (await docSnap).docs.map((doc) => ({id:doc.id, ...doc.data()}));
    } catch (err) {
      console.error('Error loading posts:', err);
      return null;
    }
  }
  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
    return this.auth.signOut();
  }
  async savePost(uid: string, postId: string) {
    const collectionRef = collection(this.firestore, 'savedPosts');
    return await addDoc(collectionRef, { uid: uid, postId: postId });
  }
}

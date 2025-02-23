// Import the functions you need from the SDKs you need
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-analytics.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  setDoc,
  where
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDceHSEMBREDnFyTVXRHv440t2n-ZSJhMQ",
  authDomain: "northwind-57283.firebaseapp.com",
  projectId: "northwind-57283",
  storageBucket: "northwind-57283.firebasestorage.app",
  messagingSenderId: "501041361118",
  appId: "1:501041361118:web:88b00c75341e6b1ca4124f",
  measurementId: "G-QNFWHNV5CR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

//usuarios
export async function saveUser(user) {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      ...user,
    });
  } catch (error) {
    console.log(error);
  }
}

export async function saveUserData(userId, userData) {
  console.log(userId);
  console.log(userData);
  try {
    await setDoc(doc(db, "users", userId), {
      ...userData,
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getUsers() {
  const querySnapshot = await getDocs(collection(db, "users"));
  let arr = [];
  querySnapshot.forEach((doc) => {
    arr.push({ ...doc.data(), id: doc.id });
  });
  return arr;
}

export async function deleteUser(userId) {
  try {
    await deleteDoc(doc(db, "users", userId));
  } catch (error) {
    console.log(error);
  }
}

export async function emailInUse(email) {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    return true;
  } else {
    return false;
  }
}

export async function getUserData(userId) {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
}

export async function getUsersByEmail(email) {
  const q = query(collection(db, "users"), where("email", "==", email));

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    return querySnapshot.docs[0];
  } else {
    return -1;
  }
}

//noticias

export async function getNews() {
  const querySnapshot = await getDocs(collection(db, "news"));
  let arr = [];
  querySnapshot.forEach((doc) => {
    arr.push({ ...doc.data(), id: doc.id });
  });
  return arr;
}

export async function getArticle(articleId) {
  const docRef = doc(db, "news", articleId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
}

export async function getLastArticle() {
  const articlesRef = collection(db, "news");

  const q = query(articlesRef, orderBy("date_create", "desc"), limit(1));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const lastArticle = querySnapshot.docs[0].data();
    return lastArticle;
  } else {
    return null; 
  }
}
export async function saveArticleData(articleId, articleData) {
  console.log(articleId);
  console.log(articleData);
  try {
    await setDoc(doc(db, "news", articleId), {
      ...articleData,
    });
  } catch (error) {
    console.log(error);
  }
}

export async function saveArticle(articleData) {
  try {
    const docRef = await addDoc(collection(db, "news"), {
      ...articleData,
    });
    return docRef.id;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteArticle(articleId) {
  try {
    await deleteDoc(doc(db, "news", articleId));
  } catch (error) {
    console.log(error);
  }
}

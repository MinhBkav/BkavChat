importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyB0fWn1HVC1pIx1GJmOy8tncRjsEekM3ao",
  authDomain: "bkavchat-a8fae.firebaseapp.com",
  projectId: "bkavchat-a8fae",
  storageBucket: "bkavchat-a8fae.firebasestorage.app",
  messagingSenderId: "112478265567",
  appId: "1:112478265567:web:84641da3579c55ad5a496a",
  measurementId: "G-Y9G5C3T18T"
});

const messaging = firebase.messaging();

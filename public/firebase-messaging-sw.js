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
messaging.onBackgroundMessage((payload) => {
  console.log(payload);
  const n = payload.data || {};
  const title = n.title || 'Thông báo';
  const userID = n.userID;
  const options = {
    body: n.content || '',
    data: payload.data || {},


  };
  self.registration.showNotification(title, options);
});

// Click vào notification
const me = JSON.parse(localStorage.getItem("me"));
if(me.id == userID)
{
  self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) if ('focus' in c) return c.focus();
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
}

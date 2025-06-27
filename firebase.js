// import { initializeApp } from 'firebase/app'
// import { getAuth } from 'firebase/auth'

// const firebaseConfig = { 
//   apiKey : "AIzaSyB0fWn1HVC1pIx1GJmOy8tncRjsEekM3ao" , 
//   authDomain : "bkavchat-a8fae.firebaseapp.com" , 
//   projectId : "bkavchat-a8fae" , 
//   storageBucket : "bkavchat-a8fae.firebasestorage.app" , 
//   messagingSenderId : "112478265567" , 
//   appId : "1:112478265567:web:84641da3579c55ad5a496a" , 
//   measurementId : "G-Y9G5C3T18T" 
// };

// const app = initializeApp(firebaseConfig)
// const auth = getAuth(app)

// export { auth }
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getMessaging } from 'firebase/messaging'; // 👈 thêm dòng này

const firebaseConfig = { 
  apiKey: "AIzaSyB0fWn1HVC1pIx1GJmOy8tncRjsEekM3ao",
  authDomain: "bkavchat-a8fae.firebaseapp.com",
  projectId: "bkavchat-a8fae",
  storageBucket: "bkavchat-a8fae.firebasestorage.app",
  messagingSenderId: "112478265567",
  appId: "1:112478265567:web:84641da3579c55ad5a496a",
  measurementId: "G-Y9G5C3T18T"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const messaging = getMessaging(app); // 👈 khởi tạo messaging

export { auth, messaging }; // 👈 export thêm messaging

// // loginFirebase.js
// import { signInWithEmailAndPassword,signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth'
// import { auth } from '../../../firebase'
// export const loginWithFirebase = async (email, password) => {
//   const userCredential = await signInWithEmailAndPassword(auth, email, password)
//   const idToken = await userCredential.user.getIdToken() // 🔑 lấy Firebase token
//   return idToken
// }
// export const loginWithGoogle = async () => {
//   const provider = new GoogleAuthProvider();
//   const result = await signInWithPopup(auth, provider);
//   console.log(result)
//   const idToken = await result.user.getIdToken();
//   return idToken;
// };

// // export const loginWithFacebook = async () => {
// //   const provider = new FacebookAuthProvider();
// //   console.log(provider)
  
// //   const result = await signInWithPopup(auth, provider);
// //   console.log(result)
// //   const idToken = await result.user.getIdToken();
// //   return idToken;
// // };
// export const loginWithFacebook = async () => {
//   const provider = new FacebookAuthProvider();

//   try {
//     console.log("📤 Đang mở popup Facebook...");
//     console.log("🌐 Provider:", provider);

//     const result = await signInWithPopup(auth, provider);

//     console.log("✅ Đăng nhập Facebook thành công:", result);

//     const idToken = await result.user.getIdToken();
//     console.log("🔐 ID Token:", idToken);

//     return idToken;
//   } catch (error) {
//     console.error("❌ Lỗi khi đăng nhập Facebook:");
//     console.error("↪️ Code:", error.code);
//     console.error("📩 Message:", error.message);
//     console.error("📄 Full error:", error);

//     // Tuỳ chọn: xử lý lỗi cụ thể nếu cần
//     if (error.code === 'auth/account-exists-with-different-credential') {
//       console.warn("⚠️ Tài khoản đã tồn tại với provider khác:", error.email);
//       // Gợi ý xử lý thêm nếu cần
//     }

//     return null; // Trả về null để gọi ở nơi khác biết login fail
//   }
// };
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider
} from 'firebase/auth';
import { getToken } from 'firebase/messaging';
import { auth, messaging } from '../../../firebase'; // đảm bảo đã export messaging từ đây

const getFcmToken = async () => {
  try {
    const fcmToken = await getToken(messaging, {
      vapidKey: 'BN9WPzE9IoYqmq_J3578Afj9yTiQCrkMpE-A3VqvV6a3ypASo7lmOaT8y_CgWIkwi_Fd7J8WTNDw9plBlKT1mPY' // 🔑 thay bằng key thật
    });
    console.log(fcmToken)
    return fcmToken;
  } catch (error) {
    console.error('❌ Không lấy được FCM token:', error);
    return null;
  }
};

export const loginWithFirebase = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const idToken = await userCredential.user.getIdToken();
  const fcmToken = await getFcmToken();

  return { idToken, fcmToken };
};

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const idToken = await result.user.getIdToken();
  const fcmToken = await getFcmToken();

  return { idToken, fcmToken };
};

export const loginWithFacebook = async () => {
  const provider = new FacebookAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();
    const fcmToken = await getFcmToken();

    return { idToken, fcmToken };
  } catch (error) {
    console.error("❌ Lỗi khi đăng nhập Facebook:", error);

    if (error.code === 'auth/account-exists-with-different-credential') {
      console.warn("⚠️ Tài khoản đã tồn tại với provider khác:", error.email);
    }

    return null;
  }
};

import { useEffect } from 'react';
import { onMessage } from 'firebase/messaging';
import { messaging } from '../../firebase';
// useFirebaseNotification.js
console.log('🔍 File useFirebaseNotification.js đã được import');

const useFirebaseNotification = () => {
  console.log('🚀 Hook useFirebaseNotification() được gọi'); // 👈 cái này phải hiện

  useEffect(() => {
    console.log('🟡 useEffect trong useFirebaseNotification chạy');

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('📩 Nhận thông báo:', payload);
      alert(payload.notification?.title);
    });

    return () => unsubscribe();
  }, []);
};

export default useFirebaseNotification;



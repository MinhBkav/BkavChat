import { useEffect } from 'react';
import { onMessage } from 'firebase/messaging';
import { messaging } from '../../firebase';
// useFirebaseNotification.js
console.log('🔍 File useFirebaseNotification.js đã được import');

const useFirebaseNotification = () => {
  console.log('🚀 Hook useFirebaseNotification() được gọi'); // 

  useEffect(() => {
    console.log('🟡 useEffect trong useFirebaseNotification chạy');

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('📩 Nhận thông báo:', payload);
    });

    return () => unsubscribe();
  }, []);
};

export default useFirebaseNotification;



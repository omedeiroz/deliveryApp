import { initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBWTjJHTFyk-fGB0IFJIINK1ariaLwOMUY",
  authDomain: "deliveryapp-67c05.firebaseapp.com",
  databaseURL: "https://deliveryapp-67c05.firebaseio.com",
  projectId: "deliveryapp-67c05",
  storageBucket: "deliveryapp-67c05.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export { db, app };
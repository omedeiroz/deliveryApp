import React, { createContext, useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const FirebaseContext = createContext();

export const FirebaseProvider = ({ children }) => {
    const [app, setApp] = useState(null);
    const [db, setDb] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            const firebaseConfig = {
                apiKey: "AIzaSyBWTjJHTFyk-fGB0IFJIINK1ariaLwOMUY",
                authDomain: "deliveryapp-67c05.firebaseapp.com",
                databaseURL: "https://deliveryapp-67c05.firebaseio.com",
                projectId: "deliveryapp-67c05",
                storageBucket: "deliveryapp-67c05.appspot.com",
                messagingSenderId: "47300083520",
                appId: "1:47300083520:android:eab0cda708e6c46e6004a5"
            };

            const firebaseApp = initializeApp(firebaseConfig);
            const firestore = getFirestore(firebaseApp);

            setApp(firebaseApp);
            setDb(firestore);
        } catch (err) {
            console.error('Firebase init error:', err);
            setError(err);
        }
    }, []);

    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Erro ao carregar o Firebase</Text>
            </View>
        );
    }

    if (!app || !db) {
        return <ActivityIndicator size="large" />;
    }

    return (
        <FirebaseContext.Provider value={{ app, db }}>
            {children}
        </FirebaseContext.Provider>
    );
};

export default FirebaseContext;
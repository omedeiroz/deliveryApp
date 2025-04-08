import { db } from './firebaseConfig';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  orderBy,
  query,
  onSnapshot,
} from 'firebase/firestore';

export const addRoute = async (data) => {
  try {
    const docRef = await addDoc(collection(db, 'rotas'), {
      ...data,
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

export const updateRoute = async (id, data) => {
  try {
    await updateDoc(doc(db, 'rotas', id), {
      ...data,
      atualizado_em: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
};

export const deleteRoute = async (id) => {
  try {
    await deleteDoc(doc(db, 'rotas', id));
  } catch (error) {
    console.error("Error deleting document: ", error);
    throw error;
  }
};

export const getRoutes = async () => {
  try {
    const q = query(collection(db, 'rotas'), orderBy('criado_em', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting documents: ", error);
    throw error;
  }
};

export const subscribeToRoutes = (callback) => {
  const q = query(collection(db, 'rotas'), orderBy('criado_em', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const routes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(routes);
  });
};
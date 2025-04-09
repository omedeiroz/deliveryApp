import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  increment,
  arrayUnion,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { uploadPhoto } from './storage';

export const addRoute = async (quantidadeParadas, quantidadePacotes) => {
  try {
    const docRef = await addDoc(collection(db, 'rotas'), {
      quantidade_paradas: quantidadeParadas,
      quantidade_pacotes: quantidadePacotes,
      pacotes_entregues: 0,
      fotos_entregas: [],
      status: 'em_andamento',
      criado_em: serverTimestamp(),
      atualizado_em: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    throw new Error('Falha ao criar rota: ' + error.message);
  }
};

export const registerDelivery = async (rotaId, fotoUri, observacoes = '') => {
  const batch = writeBatch(db);
  const rotaRef = doc(db, 'rotas', rotaId);
  
  try {
    const fotoUrl = await uploadPhoto(fotoUri);
    
    batch.update(rotaRef, {
      pacotes_entregues: increment(1),
      fotos_entregas: arrayUnion({
        url: fotoUrl,
        data: serverTimestamp(),
        observacoes
      }),
      atualizado_em: serverTimestamp()
    });

    await batch.commit();
    return true;
  } catch (error) {
    throw new Error('Falha no registro: ' + error.message);
  }
};

export const subscribeToRoutes = (callback) => {
  const q = query(collection(db, 'rotas'), orderBy('criado_em', 'desc'));
  
  return onSnapshot(q, 
    (snapshot) => {
      const routes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        data: doc.data().criado_em
      }));
      callback(routes);
    }, 
    (error) => {
      console.error("Erro na consulta:", error);
    }
  );
};

export const deleteRoute = async (id) => {
  try {
    await deleteDoc(doc(db, 'rotas', id));
  } catch (error) {
    throw new Error('Falha ao excluir rota');
  }
};
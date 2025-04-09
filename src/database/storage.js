import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const storage = getStorage();

export const uploadPhoto = async (uri) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    const fotoRef = ref(storage, `entregas/${Date.now()}.jpg`);

    await uploadBytes(fotoRef, blob);

    return await getDownloadURL(fotoRef);
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};
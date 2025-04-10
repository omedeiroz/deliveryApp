import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Alert,
  ActivityIndicator,
  TextInput,
  PermissionsAndroid,
  Platform
} from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import { registerDelivery } from '../database/database';
import Icon from 'react-native-vector-icons/MaterialIcons';

const RegistrarEntregaScreen = ({ route, navigation }) => {
  const { rotaId, totalPacotes } = route.params;
  const [fotoAtual, setFotoAtual] = useState(null);
  const [entregasRegistradas, setEntregasRegistradas] = useState(0);
  const [loading, setLoading] = useState(false);
  const [observacoes, setObservacoes] = useState('');

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);
        
        if (
          granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
        ) {
          return true;
        } else {
          Alert.alert('Permissões necessárias', 'Você precisa conceder permissões para usar a câmera');
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const tirarFoto = async () => {
    setLoading(true);
    
    try {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        setLoading(false);
        return;
      }

      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
        saveToPhotos: true,
        cameraType: 'back',
        includeBase64: false,
      });

      if (result.didCancel) {
        setLoading(false);
        return;
      }

      if (result.errorCode) {
        Alert.alert('Erro', result.errorMessage);
        setLoading(false);
        return;
      }

      if (!result.assets || result.assets.length === 0) {
        setLoading(false);
        return;
      }

      await registerDelivery(rotaId, result.assets[0].uri, observacoes);
      setEntregasRegistradas(e => {
        const newCount = e + 1;
        if (newCount >= totalPacotes) {
          Alert.alert('Rota concluída!', 'Todas as entregas foram registradas', [
            { text: 'OK', onPress: () => navigation.goBack() }
          ]);
        }
        return newCount;
      });
      setFotoAtual(result.assets[0].uri);
      setObservacoes('');
    } catch (error) {
      Alert.alert('Erro', error.message || 'Ocorreu um erro ao registrar a entrega');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Progresso: {entregasRegistradas}/{totalPacotes}
        </Text>
        <View style={styles.progressBar}>
          <View style={[
            styles.progressFill,
            { width: `${(entregasRegistradas / totalPacotes) * 100}%` }
          ]} />
        </View>
      </View>

      {fotoAtual && (
        <Image source={{ uri: fotoAtual }} style={styles.foto} />
      )}

      <TextInput
        style={styles.input}
        value={observacoes}
        onChangeText={setObservacoes}
        placeholder="Adicionar observações (opcional)"
        multiline
      />

      <TouchableOpacity 
        style={styles.button} 
        onPress={tirarFoto}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Icon name="photo-camera" size={24} color="#fff" />
            <Text style={styles.buttonText}>Registrar Entrega</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4a6da7',
  },
  foto: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 15,
    marginBottom: 20,
    minHeight: 100,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4a6da7',
    padding: 15,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RegistrarEntregaScreen;
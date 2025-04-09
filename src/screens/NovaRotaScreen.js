import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { addRoute } from '../database/database';

const NovaRotaScreen = ({ navigation }) => {
  const [paradas, setParadas] = useState('');
  const [pacotes, setPacotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleIniciarRota = async () => {
    if (!paradas || !pacotes) {
      Alert.alert('Atenção', 'Preencha todos os campos');
      return;
    }

    const numParadas = Number(paradas);
    const numPacotes = Number(pacotes);

    if (numParadas < 1 || numPacotes < 1) {
      Alert.alert('Valores inválidos', 'Os números devem ser maiores que zero');
      return;
    }

    try {
      setLoading(true);
      const rotaId = await addRoute(numParadas, numPacotes);
      navigation.navigate('RegistrarEntrega', { 
        rotaId, 
        totalPacotes: numPacotes 
      });
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Nova Rota</Text>
      
      <View style={styles.inputContainer}>
        <Icon name="location-on" size={24} color="#4a6da7" />
        <TextInput
          placeholder="Número de paradas"
          keyboardType="numeric"
          value={paradas}
          onChangeText={setParadas}
          style={styles.input}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Icon name="inventory" size={24} color="#4a6da7" />
        <TextInput
          placeholder="Total de pacotes"
          keyboardType="numeric"
          value={pacotes}
          onChangeText={setPacotes}
          style={styles.input}
        />
      </View>
      
      <TouchableOpacity
        style={styles.button}
        onPress={handleIniciarRota}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Icon name="directions-car" size={24} color="#fff" />
            <Text style={styles.buttonText}>Iniciar Rota</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#2c3e50',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4a6da7',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default NovaRotaScreen;
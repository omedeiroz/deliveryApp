import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { addRoute } from '../database/database';

const NovaRotaScreen = ({ navigation }) => {
  const [quantidadeParadas, setQuantidadeParadas] = useState('');
  const [quantidadePacotes, setQuantidadePacotes] = useState('');
  const [pacotesEntregues, setPacotesEntregues] = useState('0');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSalvarRota = async () => {
    if (!quantidadeParadas || !quantidadePacotes) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const paradas = parseInt(quantidadeParadas);
    const pacotes = parseInt(quantidadePacotes);
    const entregues = parseInt(pacotesEntregues || '0');

    if (isNaN(paradas) || isNaN(pacotes) || isNaN(entregues)) {
      Alert.alert('Erro', 'Os valores devem ser números válidos.');
      return;
    }

    if (entregues > pacotes) {
      Alert.alert('Erro', 'Pacotes entregues não podem ser maiores que o total.');
      return;
    }

    setIsSubmitting(true);

    try {
      await addRoute(paradas, new Date().toISOString(), pacotes, entregues);
      Alert.alert('Sucesso', 'Rota cadastrada com sucesso!', [
        { text: 'OK', onPress: () => navigation.navigate('MinhasRotas') }
      ]);
    } catch (error) {
      console.error('Error saving route:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar a rota.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova Rota</Text>

      <Text style={styles.label}>Quantidade de Paradas*</Text>
      <TextInput
        style={styles.input}
        value={quantidadeParadas}
        onChangeText={setQuantidadeParadas}
        placeholder="Número de paradas"
        keyboardType="numeric"
        editable={!isSubmitting}
      />

      <Text style={styles.label}>Quantidade de Pacotes*</Text>
      <TextInput
        style={styles.input}
        value={quantidadePacotes}
        onChangeText={setQuantidadePacotes}
        placeholder="Número de pacotes"
        keyboardType="numeric"
        editable={!isSubmitting}
      />

      <Text style={styles.label}>Pacotes já Entregues</Text>
      <TextInput
        style={styles.input}
        value={pacotesEntregues}
        onChangeText={setPacotesEntregues}
        placeholder="0"
        keyboardType="numeric"
        editable={!isSubmitting}
      />

      <TouchableOpacity
        style={[styles.button, isSubmitting && styles.buttonDisabled]}
        onPress={handleSalvarRota}
        disabled={isSubmitting}
      >
        <Text style={styles.buttonText}>
          {isSubmitting ? 'Salvando...' : 'Salvar Rota'}
        </Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e9e5b',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2e9e5b',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NovaRotaScreen;
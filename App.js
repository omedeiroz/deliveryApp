import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from './src/config/firebaseConfig'; // Ajuste o caminho conforme sua estrutura
import MainScreen from './src/screens/MainScreen';
import MinhasRotasScreen from './src/screens/MinhasRotasScreen';
import NovaRotaScreen from './src/screens/NovaRotaScreen';

const Stack = createStackNavigator();

const App = () => {
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Verificação robusta da inicialização do Firebase
        if (!app) {
          throw new Error('Configuração do Firebase não carregada corretamente');
        }

        const db = getFirestore(app);
        
        // Teste de conexão com o Firestore
        try {
          await getDocs(collection(db, 'connection_test'));
        } catch (testError) {
          console.warn('Teste de conexão com Firestore:', testError);
        }

        setFirebaseReady(true);
      } catch (err) {
        console.error('Erro na inicialização do Firebase:', err);
        setError(err.message);
        Alert.alert(
          'Erro de Inicialização', 
          'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.',
          [{ text: 'OK', onPress: () => console.log('Alert closed') }]
        );
      }
    };

    initializeApp();
  }, []);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Erro no Aplicativo</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.instructions}>
          Por favor, reinicie o aplicativo. Se o problema persistir, entre em contato com o suporte.
        </Text>
      </View>
    );
  }

  if (!firebaseReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a6da7" />
        <Text style={styles.loadingText}>Inicializando serviços...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#4a6da7',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{ title: 'Sistema de Rotas' }}
        />
        <Stack.Screen
          name="MinhasRotas"
          component={MinhasRotasScreen}
          options={{ title: 'Minhas Rotas' }}
        />
        <Stack.Screen
          name="NovaRota"
          component={NovaRotaScreen}
          options={{ title: 'Nova Rota' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffebee',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 20,
  },
  instructions: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default App;
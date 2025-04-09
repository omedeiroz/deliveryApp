import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { getFirestore, disableNetwork, enableNetwork } from 'firebase/firestore';
import { app } from './src/database/firebaseConfig';
import NetInfo from '@react-native-community/netinfo';
import MainScreen from './src/screens/MainScreen';
import MinhasRotasScreen from './src/screens/MinhasRotasScreen';
import NovaRotaScreen from './src/screens/NovaRotaScreen';

const Stack = createStackNavigator();

const App = () => {
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribeNetInfo = NetInfo.addEventListener(state => {
      setConnectionStatus(state.isConnected);
    });

    return () => unsubscribeNetInfo();
  }, []);

  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        if (!app) {
          throw new Error('Configuração do Firebase não encontrada');
        }

        const db = getFirestore(app);
        
        if (!connectionStatus) {
          await disableNetwork(db);
          console.log('Modo offline ativado');
        } else {
          await enableNetwork(db);
          console.log('Modo online ativado');
        }

        setFirebaseReady(true);
      } catch (err) {
        console.error('Erro na inicialização:', err);
        setError(err.message);
      }
    };

    initializeFirebase();
  }, [connectionStatus]);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Erro de Conexão</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.solutionText}>
          {connectionStatus 
            ? 'Verifique suas credenciais do Firebase' 
            : 'Sem conexão com a internet - Modo offline ativado'}
        </Text>
      </View>
    );
  }

  if (!firebaseReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a6da7" />
        <Text style={styles.loadingText}>
          {connectionStatus ? 'Conectando ao servidor...' : 'Iniciando modo offline...'}
        </Text>
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
  solutionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default App;
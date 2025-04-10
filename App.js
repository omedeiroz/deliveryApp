import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, Alert, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { getFirestore, disableNetwork, enableNetwork } from 'firebase/firestore';
import { app } from './src/database/firebaseConfig';
import NetInfo from '@react-native-community/netinfo';
import MainScreen from './src/screens/MainScreen';
import MinhasRotasScreen from './src/screens/MinhasRotasScreen';
import NovaRotaScreen from './src/screens/NovaRotaScreen';
import RegistrarEntregaScreen from './src/screens/RegistrarEntregaScreen';

LogBox.ignoreLogs(['Firebase']);

const Stack = createStackNavigator();

const App = () => {
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [showNetworkAlert, setShowNetworkAlert] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const wasOffline = connectionStatus === false;
      const isNowOnline = state.isConnected;
      
      setConnectionStatus(state.isConnected);
      
      if (wasOffline && isNowOnline && showNetworkAlert) {
        Alert.alert('✅ Conexão restaurada', 'Sincronizando dados...');
      } else if (!isNowOnline && showNetworkAlert) {
        Alert.alert('⚠️ Modo offline', 'Dados serão sincronizados quando a conexão voltar');
      }
    });

    return () => unsubscribe();
  }, [connectionStatus, showNetworkAlert]);

  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        const db = getFirestore(app);
        const state = await NetInfo.fetch();
        
        if (!state.isConnected) {
          await disableNetwork(db);
        } else {
          await enableNetwork(db);
        }

        setFirebaseReady(true);
      } catch (err) {
        Alert.alert('Erro crítico', 'Falha na inicialização do sistema');
        console.error('Initialization error:', err);
      }
    };

    initializeFirebase();
  }, []);

  if (!firebaseReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a6da7" />
        <Text style={styles.loadingText}>
          {connectionStatus === null 
            ? 'Inicializando sistema...' 
            : connectionStatus 
              ? 'Conectando aos servidores...' 
              : 'Carregando modo offline...'}
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#4a6da7' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen name="Main" component={MainScreen} options={{ title: 'Início' }} />
        <Stack.Screen name="MinhasRotas" component={MinhasRotasScreen} options={{ title: 'Minhas Rotas' }} />
        <Stack.Screen name="NovaRota" component={NovaRotaScreen} options={{ title: 'Nova Rota' }} />
        <Stack.Screen 
          name="RegistrarEntrega" 
          component={RegistrarEntregaScreen} 
          options={{ title: 'Registrar Entrega' }}
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
});

export default App;
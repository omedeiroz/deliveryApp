import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './src/screens/MainScreen';
import MinhasRotasScreen from './src/screens/MinhasRotasScreen';
import NovaRotaScreen from './src/screens/NovaRotaScreen';
import { initDatabase } from './src/database/database';
import { View, Text } from 'react-native';

const Stack = createStackNavigator();

const App = () => {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    // Initialize the database when the app starts
    const setupDatabase = async () => {
      try {
        await initDatabase();
        setDbInitialized(true);
        console.log('Database initialized successfully');
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };

    setupDatabase();
  }, []);

  if (!dbInitialized) {
    // You could show a loading screen here while the database initializes
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Inicializando banco de dados...</Text>
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
        }}
      >
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{ title: 'Tela Principal' }}
        />
        <Stack.Screen
          name="MinhasRotas"
          component={MinhasRotasScreen}
          options={{ title: 'Minhas Rotas' }}
        />
        <Stack.Screen
          name="NovaRota"
          component={NovaRotaScreen}
          options={{ title: 'Iniciar Nova Rota' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

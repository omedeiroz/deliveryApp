import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  Image
} from 'react-native';
import { subscribeToRoutes, deleteRoute } from '../database/database';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MinhasRotasScreen = ({ navigation }) => {
  const [rotas, setRotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();

  const loadRotas = () => {
    setLoading(true);
    const unsubscribe = subscribeToRoutes((routes) => {
      setRotas(routes);
      setLoading(false);
      setRefreshing(false);
    });
    return unsubscribe;
  };

  useEffect(() => {
    if (isFocused) {
      const unsubscribe = loadRotas();
      return () => unsubscribe();
    }
  }, [isFocused]);

  const onRefresh = () => {
    setRefreshing(true);
    loadRotas();
  };

  const handleDeleteRota = async (id) => {
    Alert.alert(
      'Excluir Rota',
      'Tem certeza que deseja excluir esta rota?',
      [
        { 
          text: 'Cancelar', 
          style: 'cancel' 
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRoute(id);
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir a rota.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const formatDate = (date) => {
    if (!date) return '--/--/----';
    try {
      const jsDate = date.toDate ? date.toDate() : new Date(date);
      return jsDate.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return '--/--/----';
    }
  };

  const renderRotaItem = ({ item, index }) => {
    const numeroRota = rotas.length - index;
    
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.routeIcon}>
            <Icon name="local-shipping" size={24} color="#4a6da7" />
          </View>
          <Text style={styles.cardTitle}>Rota #{numeroRota}</Text>
          <Text style={styles.cardDate}>{formatDate(item.data)}</Text>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => handleDeleteRota(item.id)}
          >
            <Icon name="delete-outline" size={24} color="#ff6b6b" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Icon name="location-pin" size={18} color="#4a6da7" />
            <Text style={styles.statValue}>{item.quantidade_paradas}</Text>
            <Text style={styles.statLabel}>Paradas</Text>
          </View>
          
          <View style={styles.statItem}>
            <Icon name="inventory" size={18} color="#4a6da7" />
            <Text style={styles.statValue}>{item.quantidade_pacotes}</Text>
            <Text style={styles.statLabel}>Pacotes</Text>
          </View>
          
          <View style={styles.statItem}>
            <Icon name="check-circle" size={18} color="#4a6da7" />
            <Text style={styles.statValue}>{item.pacotes_entregues}</Text>
            <Text style={styles.statLabel}>Entregues</Text>
          </View>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressTextContainer}>
            <Text style={styles.progressLabel}>Progresso de entrega:</Text>
            <Text style={styles.progressPercentage}>
              {Math.round((item.pacotes_entregues / item.quantidade_pacotes) * 100)}%
            </Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View style={[
              styles.progressBarFill,
              {
                width: `${(item.pacotes_entregues / item.quantidade_pacotes) * 100}%`,
                backgroundColor: item.pacotes_entregues === item.quantidade_pacotes ? '#2ecc71' : '#3498db',
              }
            ]} />
          </View>
        </View>
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a6da7" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#4a6da7" barStyle="light-content" />
      
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Minhas Rotas</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate('NovaRota')}
          >
            <Icon name="add" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
        
        {rotas.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Image
              style={styles.emptyImage}
            />
            <Text style={styles.emptyTitle}>Nenhuma rota cadastrada</Text>
            <Text style={styles.emptySubtitle}>Toque no botão "+" para adicionar uma nova rota</Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => navigation.navigate('NovaRota')}
            >
              <Text style={styles.emptyButtonText}>Criar Primeira Rota</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={rotas}
            renderItem={renderRotaItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#4a6da7']}
                tintColor="#4a6da7"
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2c3e50',
  },
  addButton: {
    backgroundColor: '#4a6da7',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 24,
    textAlign: 'center',
  },
  emptyButton: {
    backgroundColor: '#4a6da7',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 3,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  routeIcon: {
    backgroundColor: '#e8f4fc',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
  },
  cardDate: {
    fontSize: 14,
    color: '#7f8c8d',
    marginRight: 12,
  },
  deleteButton: {
    padding: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#4a6da7',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    zIndex: 10,
  },
});

export default MinhasRotasScreen;
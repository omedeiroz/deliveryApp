import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { subscribeToRoutes, deleteRoute } from '../database/database';

const MinhasRotasScreen = () => {
  const [rotas, setRotas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToRoutes((routes) => {
      setRotas(routes);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteRota = async (id) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir esta rota?',
      [
        { text: 'Cancelar', style: 'cancel' },
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
      ]
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Data inválida';
    const date = dateString.toDate ? dateString.toDate() : new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const renderRotaItem = ({ item }) => (
    <View style={styles.rotaItem}>
      <View style={styles.rotaHeader}>
        <Text style={styles.rotaDate}>{formatDate(item.data)}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteRota(item.id)}
        >
          <Text style={styles.deleteButtonText}>X</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.rotaDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Paradas:</Text>
          <Text style={styles.detailValue}>{item.quantidade_paradas}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Pacotes:</Text>
          <Text style={styles.detailValue}>{item.quantidade_pacotes}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Entregues:</Text>
          <Text style={styles.detailValue}>{item.pacotes_entregues}</Text>
        </View>
        <View style={styles.progressContainer}>
          <View style={[
            styles.progressBar,
            {
              width: `${(item.pacotes_entregues / item.quantidade_pacotes) * 100}%`,
              backgroundColor: item.pacotes_entregues === item.quantidade_pacotes ? '#2e9e5b' : '#4a6da7',
            }
          ]} />
          <Text style={styles.progressText}>
            {Math.round((item.pacotes_entregues / item.quantidade_pacotes) * 100)}%
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a6da7" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Rotas</Text>
      
      {rotas.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma rota encontrada</Text>
      ) : (
        <FlatList
          data={rotas}
          renderItem={renderRotaItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4a6da7',
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    paddingBottom: 20,
  },
  rotaItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  rotaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  rotaDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  deleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  rotaDetails: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  progressContainer: {
    height: 20,
    backgroundColor: '#eee',
    borderRadius: 10,
    marginTop: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    borderRadius: 10,
  },
  progressText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,
  },
});

export default MinhasRotasScreen;
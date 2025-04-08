"use client"

import React, { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native"
import { getAllRotas, deleteRota } from "../database/database"
import { useFocusEffect } from "@react-navigation/native"

const MinhasRotasScreen = () => {
  const [rotas, setRotas] = useState([])
  const [loading, setLoading] = useState(true)

  const loadRotas = async () => {
    try {
      setLoading(true)
      const rotasData = await getAllRotas()
      setRotas(rotasData)
    } catch (error) {
      console.error("Error loading routes:", error)
      Alert.alert("Erro", "Não foi possível carregar as rotas.")
    } finally {
      setLoading(false)
    }
  }

  // Reload data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadRotas()
    }, []),
  )

  const handleDeleteRota = (id) => {
    Alert.alert("Confirmar exclusão", "Tem certeza que deseja excluir esta rota?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteRota(id)
            // Refresh the list
            loadRotas()
          } catch (error) {
            console.error("Error deleting route:", error)
            Alert.alert("Erro", "Não foi possível excluir a rota.")
          }
        },
      },
    ])
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR")
  }

  const renderRotaItem = ({ item }) => {
    return React.createElement(
      View,
      { style: styles.rotaItem },
      React.createElement(
        View,
        { style: styles.rotaHeader },
        React.createElement(Text, { style: styles.rotaDate }, formatDate(item.data)),
        React.createElement(
          TouchableOpacity,
          {
            style: styles.deleteButton,
            onPress: () => handleDeleteRota(item.id),
          },
          React.createElement(Text, { style: styles.deleteButtonText }, "X"),
        ),
      ),
      React.createElement(
        View,
        { style: styles.rotaDetails },
        React.createElement(
          View,
          { style: styles.detailItem },
          React.createElement(Text, { style: styles.detailLabel }, "Paradas:"),
          React.createElement(Text, { style: styles.detailValue }, item.quantidade_paradas),
        ),
        React.createElement(
          View,
          { style: styles.detailItem },
          React.createElement(Text, { style: styles.detailLabel }, "Pacotes:"),
          React.createElement(Text, { style: styles.detailValue }, item.quantidade_pacotes),
        ),
        React.createElement(
          View,
          { style: styles.detailItem },
          React.createElement(Text, { style: styles.detailLabel }, "Entregues:"),
          React.createElement(Text, { style: styles.detailValue }, item.quantidade_pacotes_entregues),
        ),
        React.createElement(
          View,
          { style: styles.progressContainer },
          React.createElement(View, {
            style: [
              styles.progressBar,
              {
                width: `${(item.quantidade_pacotes_entregues / item.quantidade_pacotes) * 100}%`,
                backgroundColor: item.quantidade_pacotes_entregues === item.quantidade_pacotes ? "#2e9e5b" : "#4a6da7",
              },
            ],
          }),
          React.createElement(
            Text,
            { style: styles.progressText },
            `${Math.round((item.quantidade_pacotes_entregues / item.quantidade_pacotes) * 100)}%`,
          ),
        ),
      ),
    )
  }

  return React.createElement(
    View,
    { style: styles.container },
    React.createElement(Text, { style: styles.title }, "Minhas Rotas"),

    loading
      ? React.createElement(Text, { style: styles.loadingText }, "Carregando rotas...")
      : rotas.length === 0
        ? React.createElement(Text, { style: styles.emptyText }, "Nenhuma rota encontrada.")
        : React.createElement(FlatList, {
            data: rotas,
            renderItem: renderRotaItem,
            keyExtractor: (item) => item.id.toString(),
            contentContainerStyle: styles.listContainer,
          }),
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4a6da7",
    marginBottom: 20,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  rotaItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  rotaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 8,
  },
  rotaDate: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  deleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ff6b6b",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  rotaDetails: {
    gap: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  progressContainer: {
    height: 20,
    backgroundColor: "#eee",
    borderRadius: 10,
    marginTop: 8,
    overflow: "hidden",
    position: "relative",
  },
  progressBar: {
    height: "100%",
    borderRadius: 10,
  },
  progressText: {
    position: "absolute",
    width: "100%",
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
    lineHeight: 20,
    textShadow: "0px 0px 2px #000",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
})

export default MinhasRotasScreen;

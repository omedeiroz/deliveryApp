"use client"

import React, { useState } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native"
import { addRota } from "../database/database"

const NovaRotaScreen = ({ navigation }) => {
  const [quantidadeParadas, setQuantidadeParadas] = useState("")
  const [quantidadePacotes, setQuantidadePacotes] = useState("")
  const [quantidadePacotesEntregues, setQuantidadePacotesEntregues] = useState("0")

  const handleSalvarRota = async () => {
    // Validate inputs
    if (!quantidadeParadas || !quantidadePacotes) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.")
      return
    }

    const paradas = Number.parseInt(quantidadeParadas)
    const pacotes = Number.parseInt(quantidadePacotes)
    const pacotesEntregues = Number.parseInt(quantidadePacotesEntregues || "0")

    if (isNaN(paradas) || isNaN(pacotes) || isNaN(pacotesEntregues)) {
      Alert.alert("Erro", "Os valores devem ser números.")
      return
    }

    if (pacotesEntregues > pacotes) {
      Alert.alert("Erro", "A quantidade de pacotes entregues não pode ser maior que a quantidade total de pacotes.")
      return
    }

    try {
      // Get current date in ISO format (YYYY-MM-DD)
      const currentDate = new Date().toISOString().split("T")[0]

      // Save to database
      await addRota(paradas, currentDate, pacotes, pacotesEntregues)

      Alert.alert("Sucesso", "Rota cadastrada com sucesso!", [
        { text: "OK", onPress: () => navigation.navigate("MinhasRotas") },
      ])
    } catch (error) {
      console.error("Error saving route:", error)
      Alert.alert("Erro", "Ocorreu um erro ao salvar a rota.")
    }
  }

  return React.createElement(
    View,
    { style: styles.container },
    React.createElement(Text, { style: styles.title }, "Iniciar Nova Rota"),

    React.createElement(Text, { style: styles.label }, "Quantidade de Paradas:"),
    React.createElement(TextInput, {
      style: styles.input,
      value: quantidadeParadas,
      onChangeText: setQuantidadeParadas,
      placeholder: "Número de paradas",
      keyboardType: "numeric",
    }),

    React.createElement(Text, { style: styles.label }, "Quantidade de Pacotes:"),
    React.createElement(TextInput, {
      style: styles.input,
      value: quantidadePacotes,
      onChangeText: setQuantidadePacotes,
      placeholder: "Número de pacotes",
      keyboardType: "numeric",
    }),

    React.createElement(Text, { style: styles.label }, "Pacotes já Entregues:"),
    React.createElement(TextInput, {
      style: styles.input,
      value: quantidadePacotesEntregues,
      onChangeText: setQuantidadePacotesEntregues,
      placeholder: "0",
      keyboardType: "numeric",
    }),

    React.createElement(
      TouchableOpacity,
      {
        style: styles.button,
        onPress: handleSalvarRota,
      },
      React.createElement(Text, { style: styles.buttonText }, "Salvar Rota"),
    ),
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2e9e5b",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#2e9e5b",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default NovaRotaScreen;

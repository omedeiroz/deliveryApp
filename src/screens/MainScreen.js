import React from "react"
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from "react-native"
import { useNavigation } from "@react-navigation/native"

const MainScreen = () => {
  const navigation = useNavigation()

  return React.createElement(
    View,
    { style: styles.container },
    React.createElement(StatusBar, { barStyle: "light-content" }),
    React.createElement(Text, { style: styles.title }, "Sistema de Rotas"),
    React.createElement(
      View,
      { style: styles.buttonContainer },
      React.createElement(
        TouchableOpacity,
        {
          style: [styles.button, styles.minhasRotasButton],
          onPress: () => navigation.navigate("MinhasRotas"),
        },
        React.createElement(Text, { style: styles.buttonText }, "Minhas Rotas"),
      ),
      React.createElement(
        TouchableOpacity,
        {
          style: [styles.button, styles.novaRotaButton],
          onPress: () => navigation.navigate("NovaRota"),
        },
        React.createElement(Text, { style: styles.buttonText }, "Iniciar Nova Rota"),
      ),
    ),
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#333",
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 300,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  minhasRotasButton: {
    backgroundColor: "#4a6da7",
  },
  novaRotaButton: {
    backgroundColor: "#2e9e5b",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
})

export default MainScreen;

import { openDatabase } from "expo-sqlite"

// Open or create the database
const db = openDatabase("rotas.db")

// Initialize the database
export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS rotas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          quantidade_paradas INTEGER NOT NULL,
          data TEXT NOT NULL,
          quantidade_pacotes INTEGER NOT NULL,
          quantidade_pacotes_entregues INTEGER NOT NULL
        )`,
        [],
        () => {
          console.log("Table 'rotas' created successfully")
          resolve()
        },
        (_, error) => {
          console.error("Error creating table 'rotas':", error)
          reject(error)
        },
      )
    })
  })
}

// CRUD Operations for rotas

// Create - Add a new route
export const addRota = (quantidadeParadas, data, quantidadePacotes, quantidadePacotesEntregues) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO rotas (quantidade_paradas, data, quantidade_pacotes, quantidade_pacotes_entregues) VALUES (?, ?, ?, ?)",
        [quantidadeParadas, data, quantidadePacotes, quantidadePacotesEntregues],
        (_, { insertId }) => {
          console.log(`New route added with ID: ${insertId}`)
          resolve(insertId)
        },
        (_, error) => {
          console.error("Error adding route:", error)
          reject(error)
        },
      )
    })
  })
}

// Read - Get all routes
export const getAllRotas = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM rotas ORDER BY data DESC",
        [],
        (_, { rows }) => {
          resolve(rows._array)
        },
        (_, error) => {
          console.error("Error fetching routes:", error)
          reject(error)
        },
      )
    })
  })
}

// Read - Get a specific route by ID
export const getRotaById = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM rotas WHERE id = ?",
        [id],
        (_, { rows }) => {
          if (rows.length > 0) {
            resolve(rows._array[0])
          } else {
            resolve(null)
          }
        },
        (_, error) => {
          console.error(`Error fetching route with ID ${id}:`, error)
          reject(error)
        },
      )
    })
  })
}

// Update - Update a route
export const updateRota = (id, quantidadeParadas, data, quantidadePacotes, quantidadePacotesEntregues) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE rotas SET quantidade_paradas = ?, data = ?, quantidade_pacotes = ?, quantidade_pacotes_entregues = ? WHERE id = ?",
        [quantidadeParadas, data, quantidadePacotes, quantidadePacotesEntregues, id],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            console.log(`Route with ID ${id} updated successfully`)
            resolve(true)
          } else {
            console.log(`No route found with ID ${id}`)
            resolve(false)
          }
        },
        (_, error) => {
          console.error(`Error updating route with ID ${id}:`, error)
          reject(error)
        },
      )
    })
  })
}

// Delete - Delete a route
export const deleteRota = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM rotas WHERE id = ?",
        [id],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            console.log(`Route with ID ${id} deleted successfully`)
            resolve(true)
          } else {
            console.log(`No route found with ID ${id}`)
            resolve(false)
          }
        },
        (_, error) => {
          console.error(`Error deleting route with ID ${id}:`, error)
          reject(error)
        },
      )
    })
  })
}

// Get statistics about routes
export const getRotasStats = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT 
          COUNT(*) as total_rotas,
          SUM(quantidade_pacotes) as total_pacotes,
          SUM(quantidade_pacotes_entregues) as total_entregues,
          AVG(quantidade_paradas) as media_paradas
        FROM rotas`,
        [],
        (_, { rows }) => {
          resolve(rows._array[0])
        },
        (_, error) => {
          console.error("Error fetching route statistics:", error)
          reject(error)
        },
      )
    })
  })
}

export default {
  initDatabase,
  addRota,
  getAllRotas,
  getRotaById,
  updateRota,
  deleteRota,
  getRotasStats,
};

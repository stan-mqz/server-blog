import express from 'express'
import router from './routes/router'
import db from './config/db'
import colors from 'colors'

const server = express()
server.use(express.json())

async function connectDataBase() {
  try {
    await db.authenticate()
    await db.sync()
    console.log(colors.blue.bold('Conexión exitosa'))
  } catch (error) {
    console.log(colors.red.bold('Hubo un error al conectar a la BD'))
  }
}

connectDataBase()
server.use('/api', router)

export default server
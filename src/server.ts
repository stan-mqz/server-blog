import express from 'express'
import router from './routes/router'
import db from './config/db'
import colors from 'colors'
import authRouter from './routes/auth'
import cookieParser from 'cookie-parser'

const server = express()

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



//For every routing file you need to create a new instance

server.use(express.json())
server.use(express.urlencoded({ extended: true }))

//Install cookie-parser and its types in order to process cookies
server.use(cookieParser())

server.use('/api', router)
server.use('/auth', authRouter)


export default server
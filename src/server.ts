import express from 'express'
import dotenv from 'dotenv'
import router from './routes/usersRouter'
import db from './config/db'
import colors from 'colors'
import authRouter from './routes/authRouter'
import cookieParser from 'cookie-parser'
import postsRouter from './routes/postsRouter'
import commentsRouter from './routes/commentsRouter'

const server = express()
dotenv.config() 

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

server.use('/user', router)
server.use('/auth', authRouter)
server.use('/posts', postsRouter)
server.use('/comments', commentsRouter)



export default server
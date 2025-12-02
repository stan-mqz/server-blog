import {Sequelize } from "sequelize-typescript"
import dotenv from "dotenv"
import User from "../models/Users.model"
import Post from "../models/Posts.model"
import Like from "../models/Likes.model"
import Comment from "../models/Comments.model"

dotenv.config()

const db = new Sequelize(process.env.DATABASE_URL!, {
  // models: [__dirname + "/../models/**/*.ts"],
  models: [User, Post, Like, Comment],
  logging: false
})

export default db
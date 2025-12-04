import { Request, Response } from "express"
import Post from "../models/Posts.model"

export const getAllPosts = async (req : Request, res : Response) => {
    
    const posts = await Post.findAll()

    const postsData = posts.map(post => post.toJSON())

    res.json(postsData)
}
import { Request, Response } from "express";
import User from "../models/Users.model";
import Post from "../models/Posts.model";
import { UserType } from "../types";

export const getUserById = async (req: Request, res: Response) => {
    
    const userId = req.params.id

    const user = await User.findByPk(userId, {
        include: [Post]
    })

    if (!user) {
       return res.status(404).json({Message: 'User Not Found'})
    }
    
    const userData : UserType = user.toJSON()

    return res.json(
        {
            id: userData.id_user,
            username: userData.username,
            avatar: userData.avatar,
            posts: userData.posts
        }
    )
}
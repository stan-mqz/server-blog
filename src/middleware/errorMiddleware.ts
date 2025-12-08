import { Request, Response, NextFunction } from "express"
import { validationResult } from "express-validator"
import fs from 'fs'

export const handleInputErrors = (req : Request, res : Response, next : NextFunction) => {
    
    
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        fs.unlinkSync(req.file.path)
        return res.status(400).json({errors: errors.array()})    
    }
    

    next()
}
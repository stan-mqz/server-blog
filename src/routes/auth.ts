import { Router } from 'express'
const router = Router()
import { loginUser, registerUser } from '../handlers/auth';


router.post("/register", registerUser)
router.post('/login', loginUser)

export default router

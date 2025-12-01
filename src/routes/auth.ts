import { Router } from 'express'
const router = Router()
import { getMe, loginUser, registerUser } from '../handlers/auth';
import { protect } from '../middleware/authMiddleware';


router.post("/register", registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)

export default router

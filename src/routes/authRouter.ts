import { Router } from 'express'
const router = Router()
import { getMe, loginUser, recoverEmail, recoverPassword, registerUser } from '../handlers/authHandler';
import { protect } from '../middleware/authMiddleware';


router.post("/register", registerUser)
router.post('/login', loginUser)
router.post('/recover-email', recoverEmail)
router.post('/recover-password', recoverPassword)
router.get('/me', protect, getMe)


export default router

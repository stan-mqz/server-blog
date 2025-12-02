import { Router } from 'express'
import { getUserById } from '../handlers/users'
import { protect } from '../middleware/authMiddleware'
const router = Router()


router.get('/profile/:id',protect, getUserById)


 export default router
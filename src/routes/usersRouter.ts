import { Router } from 'express'
import { getUserById, updateUserData } from '../handlers/usersHandler'
import { protect } from '../middleware/authMiddleware'
const router = Router()


router.get('/profile/:id',protect, getUserById)
router.patch('/update-info/:id', protect, updateUserData)


 export default router
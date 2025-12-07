import { Router } from 'express'
import { getUserById, updateUserData, updateUserPassword } from '../handlers/usersHandler'
import { protect } from '../middleware/authMiddleware'
import { body } from 'express-validator'
const router = Router()


router.get(
    '/profile',
    protect, 
    getUserById
)
router.patch('/update-info', protect, updateUserData)
router.patch('/update-password', protect, updateUserPassword)


 export default router
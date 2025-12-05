import { Router } from 'express'
import { getAllPosts } from '../handlers/postsHandler'
import { protect } from '../middleware/authMiddleware'
const router = Router()


router.get('/all', protect, getAllPosts)

export default router

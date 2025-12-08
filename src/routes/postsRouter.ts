import { Router } from 'express'
import { createNewPost, getAllPosts, getPostById } from '../handlers/postsHandler'
import { protect } from '../middleware/authMiddleware'
import upload from '../middleware/uploadMiddleware'
import { parseFormData } from '../middleware/parseFormData'
const router = Router()


router.get('/all', protect, getAllPosts)
router.get('/:id_post', protect, getPostById)
router.post(
    '/create-post', 
    protect,
    upload.single('image'), 
    parseFormData,
    createNewPost
)


export default router

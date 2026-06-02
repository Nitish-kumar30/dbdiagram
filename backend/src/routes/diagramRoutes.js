import express from 'express';
const router = express.Router();
import authMiddleware from '../middleware/authMiddleware';

router.use(authMiddleware);



export default router;
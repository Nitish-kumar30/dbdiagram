import express from 'express';
const router = express.Router();
import authMiddleware from '../middleware/authMiddleware.js';
import {getLatestDiagram,saveDiagram,updateDiagram, 
  shareDiagram,getSharedDiagram} from '../controllers/diagramController.js';

router.get('/share/:token', getSharedDiagram);

router.use(authMiddleware);

router.get('/latest', getLatestDiagram);
router.post('/', saveDiagram);

router.put('/:id', updateDiagram);

router.post('/:id/share', shareDiagram);

export default router;
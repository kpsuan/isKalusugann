import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { upload, getdocuments, deletedocuments,updatedocuments  } from '../controllers/docs.controller.js';
const router = express.Router();

router.post('/upload', verifyToken, upload)
router.get('/getdocuments', getdocuments)
router.delete('/deletedocuments/:docsId/:userId', verifyToken, deletedocuments);
router.put('/updatedocuments/:docsId/:userId', verifyToken, updatedocuments);

export default router;

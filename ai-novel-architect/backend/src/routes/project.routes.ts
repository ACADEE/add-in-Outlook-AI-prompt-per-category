import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller';

const router = Router();

// Project initialization
router.post('/initialize', ProjectController.initializeProject);

// Chapter operations
router.post('/chapter/generate', ProjectController.generateChapter);
router.post('/chapter/audit', ProjectController.auditChapter);
router.post('/chapter/validate', ProjectController.validateChapter);

// Project retrieval
router.get('/:projectId', ProjectController.getProject);

// Test API connection
router.post('/test-connection', ProjectController.testConnection);

export default router;

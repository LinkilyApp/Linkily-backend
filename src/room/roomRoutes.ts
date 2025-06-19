import { Router } from 'express';
import { RoomController } from './roomController';

const router = Router();
const roomController = new RoomController();

router.get('/self/list-members', roomController.selfListMembers);

export default router;
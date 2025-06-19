import { Router } from 'express';
import { DevicesController } from './devicesController';

const router = Router();
const devicesController = new DevicesController();

router.get('/self/info', devicesController.selfGetDeviceInfo);
router.put('/self/geolocation', devicesController.selfUpdateGeolocation);

export default router;
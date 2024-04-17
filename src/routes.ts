import express, { Router } from 'express';
import * as controllers from './controllers';

const router: Router = express.Router();

router.get('/mail/read/:email/:messageId', controllers.readMail);
router.get('/mail/list/:email', controllers.getMails);
router.get('/mail/list/:email/:date', controllers.getMailsDate);
router.get('/mail/list/:email/:date/kplus', controllers.getMailsDateKPLUS);

export default router;

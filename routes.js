const express = require('express');
const controllers = require('./controllers');
const router = express.Router();

router.get('/mail/read/:email/:messageId', controllers.readMail);
router.get('/mail/list/:email', controllers.getMails);
router.get('/mail/list/:email/:date', controllers.getMailsDate);
router.get('/mail/list/:email/:date/kplus', controllers.getMailsDateKPLUS);

module.exports = router;

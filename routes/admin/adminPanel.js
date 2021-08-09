const express = require('express');
const adminPanelController = require('../../controllers/admin/adminPanel');

const router = express.Router();

router.get('/admin', adminPanelController.getAdminPanel);

module.exports = router;

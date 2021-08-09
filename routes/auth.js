const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router
	.route('/signup')
	.get(authController.getSignup)
	.post(authController.postSignup);

router
	.route('/login')
	.get(authController.getLogin)
	.post(authController.postLogin);

router.post('/logout', authController.postLogout);
module.exports = router;

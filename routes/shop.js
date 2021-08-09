const express = require('express');
const homeController = require('../controllers/shop');

const router = express.Router();

router.get('/', homeController.getHome);
router.get('/collections/:title', homeController.getCollection);
// router.get('/caterpillar', homeController.getCaterpillar);
// router.get('/artisian', homeController.getArtisian);
router.get('/shop', homeController.getShop);

module.exports = router;

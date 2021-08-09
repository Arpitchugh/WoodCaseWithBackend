const express = require('express');
const newArrivalController = require('../../controllers/admin/newArrival');

const multerSingleFile = require('../../middleware/multerSingleFile');
const multerMultipleFile = require('../../middleware/multerMultipleFile');

const router = express.Router();

router.get('/new-arrivals', newArrivalController.getAllNewArrivals);

router
	.route('/new-arrivals/add-type')
	.get(newArrivalController.getAddNewType)
	.post(multerSingleFile, newArrivalController.postNewType);

router
	.route('/new-arrivals/delete-type')
	.post(newArrivalController.postDeleteType);

router
	.route('/new-arrivals/add-product')
	.get(newArrivalController.getAddProduct)
	.post(multerMultipleFile, newArrivalController.postAddProduct);

router
	.route('/new-arrivals/delete-product')
	.post(newArrivalController.postDeleteProduct);

router
	.route('/new-arrivals/update-product/:productId')
	.get(newArrivalController.getUpdateProduct)
	.post(multerMultipleFile, newArrivalController.postUpdateProduct);

module.exports = router;

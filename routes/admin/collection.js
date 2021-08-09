const express = require('express');
const collectionController = require('../../controllers/admin/collection');
const multerMultipleFile = require('../../middleware/multerMultipleFile');
const multerSingleFile = require('../../middleware/multerSingleFile');

const router = express.Router();

router.route('/collections').get(collectionController.getCollection);

router
	.route('/collections/add-collection')
	.get(collectionController.getNewType)
	.post(multerSingleFile, collectionController.postNewType);

router
	.route('/collections/delete-collection')
	.post(collectionController.postDeleteType);

router
	.route('/collections/add-product')
	.get(collectionController.getNewProduct)
	.post(multerMultipleFile, collectionController.postNewProduct);

router
	.route('/collections/update-product/:productId')
	.get(collectionController.getUpdateProduct)
	.post(multerMultipleFile, collectionController.postUpdateProduct);

router
	.route('/collections/delete-product')
	.post(collectionController.postDeleteProduct);
module.exports = router;

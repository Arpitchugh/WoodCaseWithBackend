const fs = require('fs');

const Collection = require('../../models/collection');

/* ----------------------------- all collections ---------------------------- */
exports.getCollection = async (req, res) => {
	try {
		// Get all collections
		const collections = await Collection.find({});
		res.render('allCollections', {
			csrfToken: req.csrfToken(),
			collections: collections,
		});
	} catch (err) {
		if (err) throw new Error(err);
	}
};

/* -------------------------------- new type -------------------------------- */

exports.getNewType = (req, res) => {
	res.render('addNewCollectionType', {
		csrfToken: req.csrfToken(),
	});
};

exports.postNewType = async (req, res) => {
	try {
		// get input from user
		const { title, description, semiDescription } = req.body;
		const image = req.file;

		// check if type already exists
		const existingType = await Collection.findOne({ title });

		if (existingType) return res.send('type already exists');

		// create new collection
		const newType = new Collection({
			title: title,
			description: description,
			semiDescription: semiDescription,
			bgImage: image,
			products: [],
		});
		newType.save();

		res.redirect('/admin/collections/add-collection');
	} catch (err) {
		if (err) throw new Error(err);
	}
};

/* ------------------------------- delete type ------------------------------ */
exports.postDeleteType = async (req, res) => {
	try {
		// get type id  from input
		const { id } = req.body;

		// find type in database
		const type = await Collection.findOne({ _id: id });

		// delete image of type
		fs.unlink(`./${type.bgImage.path}`, err => {
			if (err) throw new Error(err);
		});

		// delete images of all products of type
		type.products.forEach(product => {
			product.images.forEach(image => {
				fs.unlink(`./${image.path}`, err => {
					if (err) throw new Error(err);
				});
			});
		});

		// delete type
		await Collection.deleteOne({ _id: id });

		type.save();

		res.redirect('/admin/collections');
	} catch (err) {
		if (err) throw new Error(err);
	}
};

/* ------------------------------- new product ------------------------------ */

exports.getNewProduct = async (req, res) => {
	try {
		// check for existing collection
		const existingCollections = await Collection.find({});

		res.render('addNewCollectionProduct', {
			csrfToken: req.csrfToken(),
			collections: existingCollections,
		});
	} catch (err) {
		if (err) throw new Error(err);
	}
};

exports.postNewProduct = async (req, res) => {
	try {
		// get input from user
		const { collection, title, description, price } = req.body;
		const image = req.files;

		// check number of images
		if (image.length <= 1 || image.length > 2)
			return res.send('only 2 images can be uploaded');

		// check existing collection
		const existingCollection = await Collection.findOne({
			title: collection,
		});

		// create new product and add it to existing collection
		if (existingCollection) {
			existingCollection.products.push({
				title: title,
				description: description,
				price: price,
				images: image,
			});

			existingCollection.save();
			res.redirect('/admin/collections/add-product');
		} else {
			res.send('no collection found');
		}
	} catch (err) {
		if (err) throw new Error(err);
	}
};

/* ----------------------------- update product ----------------------------- */
exports.getUpdateProduct = async (req, res) => {
	try {
		// get productId and type from url
		const { productId } = req.params;
		const { type } = req.query;

		// find product in database
		const productType = await Collection.findOne({ title: type });
		const product = await productType.products.find(
			product => product._id.toString() === productId
		);

		// render page
		res.render('updateCollections', {
			csrfToken: req.csrfToken(),
			title: product.title,
			price: product.price,
			description: product.description,
			type: type,
			productId: productId,
		});
	} catch (err) {
		if (err) throw new Error(err);
	}
};

exports.postUpdateProduct = async (req, res) => {
	try {
		// get productId and type from url
		const { productId } = req.params;
		const { type: typeName } = req.query;

		// get input from user
		const { title, price, description } = req.body;
		const images = req.files;

		// find product in database
		const type = await Collection.findOne({ title: typeName });
		const product = await type.products.find(
			product => product._id.toString() === productId
		);

		// update product

		if (product) {
			product.title = title;
			product.price = price;
			product.description = description;

			if (images.length > 0) {
				// delete existing image
				product.images.forEach(image => {
					fs.unlink(`./${image.path}`, err => {
						if (err) throw new Error(err);
					});
				});

				// add new images
				if (images.length <= 1 || images.length > 2)
					return res.send('only 2 images can be uploaded');

				product.images = images;
			}

			type.save();
		}

		res.redirect('/admin/collections/');
	} catch (err) {
		if (err) throw new Error(err);
	}
};

/* ----------------------------- delete product ----------------------------- */

exports.postDeleteProduct = async (req, res) => {
	try {
		// get input from user
		const { id: productId, type: typeName } = req.body;

		// find Type in database
		const type = await Collection.findOne({ title: typeName });

		// find product in type
		const product = type.products.find(
			product => product._id.toString() == productId
		);

		// delete images of product from file system
		product.images.forEach(image => {
			fs.unlink(`./${image.path}`, err => {
				if (err) throw new Error(err);
			});
		});

		// get index of product
		const productIndex = await type.products.indexOf(product);

		// remove product from type
		type.products.splice(productIndex, 1);

		type.save();

		res.redirect('/admin/collections');
	} catch (err) {
		if (err) throw new Error(err);
	}
};

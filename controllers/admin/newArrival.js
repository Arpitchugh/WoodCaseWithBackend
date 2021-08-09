const fs = require('fs');

const Type = require('../../models/newArrivals');

/* ---------------------------- all new arrivals ---------------------------- */
exports.getAllNewArrivals = async (req, res) => {
	try {
		const allTypes = await Type.find();

		res.render('newArrivals', {
			types: allTypes,
			csrfToken: req.csrfToken(),
		});
	} catch (err) {
		if (err) throw new Error(err);
	}
};

/* -------------------------------- new type -------------------------------- */

exports.getAddNewType = (req, res) => {
	res.render('addNewArrivalsType', {
		csrfToken: req.csrfToken(),
	});
};

exports.postNewType = async (req, res) => {
	try {
		// get title and image from req
		const { title } = req.body;
		const image = req.file;

		// check if type already exists
		const existingType = await Type.findOne({ title: title });

		if (existingType) return res.send('this type already exists');

		// add new collection in db
		const newCollection = new Type({
			title: title,
			imageTitle: image.originalname,
			imagePath: image.path,
			products: [],
		});
		newCollection.save();

		res.redirect('/admin/new-arrivals/add-type');
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
		const type = await Type.findOne({ _id: id });

		// delete image of type
		fs.unlink(`./${type.imagePath}`, err => {
			if (err) throw new Error(err);
		});

		// delete images of all products of type
		type.products.forEach(product => {
			fs.unlink(`./${product.image1.path}`, err => {
				if (err) throw new Error(err);
			});

			fs.unlink(`./${product.image2.path}`, err => {
				if (err) throw new Error(err);
			});
		});

		// delete type
		await Type.deleteOne({ _id: id });

		type.save();

		res.redirect('/admin/new-arrivals');
	} catch (err) {
		if (err) throw new Error(err);
	}
};

/* ------------------------------- new product ------------------------------ */

exports.getAddProduct = async (req, res) => {
	try {
		const type = await Type.find({});

		res.render('addNewArrivalsProduct', {
			csrfToken: req.csrfToken(),
			types: type,
		});
	} catch (err) {
		if (err) throw new Error(err);
	}
};

exports.postAddProduct = async (req, res) => {
	try {
		// get user inputs
		const { type, title, description, price } = req.body;
		const image1 = req.files.find(image => image.fieldname === 'image1');
		const image2 = req.files.find(image => image.fieldname === 'image2');

		// find existing type
		const existingType = await Type.findOne({ title: type });

		// if existing type exists than add product to type
		if (existingType) {
			existingType.products.push({
				title: title,
				description: description,
				price: price,
				image1: image1,
				image2: image2,
			});

			existingType.save();
			res.redirect('/admin/new-arrivals/add-product');
		} else {
			res.send('type not found');
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
		const productType = await Type.findOne({ title: type });
		const product = await productType.products.find(
			product => product._id.toString() === productId
		);

		// render page
		res.render('updateNewArrivals', {
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
		// get id and type from url
		const { productId } = req.params;
		const { type } = req.query;

		// get user inputs
		const { title, description, price } = req.body;

		const image1 = req.files.find(image => image.fieldname === 'image1');
		const image2 = req.files.find(image => image.fieldname === 'image2');

		// find product in database
		const productType = await Type.findOne({ title: type });
		const product = await productType.products.find(
			product => product._id.toString() === productId
		);

		if (product) {
			// update product in database
			product.title = title;
			product.description = description;
			product.price = price;

			if (req.files.length > 0) {
				if (image1) {
					// remove existing image
					fs.unlink(`./${product.image1.path}`, err => {
						if (err) throw new Error(err);
					});

					// add new image to product
					product.image1 = image1;
				}
				if (image2) {
					// remove existing image
					fs.unlink(`./${product.image2.path}`, err => {
						if (err) throw new Error(err);
					});

					// add new image to product
					product.image2 = image2;
				}
			}

			productType.save();
		} else {
			throw new Error('product not found');
		}
		res.redirect('/admin/new-arrivals');
	} catch (err) {
		if (err) throw new Error(err);
	}
};

/* ----------------------------- delete product ----------------------------- */

exports.postDeleteProduct = async (req, res) => {
	try {
		// get product id from input
		const { productId, typeName } = req.body;

		// find type in db
		const type = await Type.findOne({ title: typeName });

		// find product in type
		const product = type.products.find(
			product => product._id.toString() == productId
		);

		// get images from product
		const { image1 } = product;
		const { image2 } = product;

		// delete images from upload folder
		await fs.unlink(`./${image1.path}`, err => {
			if (err) throw new Error(err);
		});
		await fs.unlink(`./${image2.path}`, err => {
			if (err) throw new Error(err);
		});

		// get index of product
		const productIndex = await type.products.indexOf(product);

		// remove product from type
		type.products.splice(productIndex, 1);

		type.save();

		res.redirect('/admin/new-arrivals');
	} catch (err) {
		if (err) throw new Error(err);
	}
};

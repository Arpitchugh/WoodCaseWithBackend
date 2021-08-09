const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	price: { type: Number, required: true },
	images: [],
});

const collectionSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	semiDescription: { type: String, required: true },
	bgImage: {},
	products: [productSchema],
});

module.exports = mongoose.model('Collection', collectionSchema);

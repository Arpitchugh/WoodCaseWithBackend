const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	price: { type: Number, required: true },
	image1: {},
	image2: {},
});

const typeSchema = new mongoose.Schema({
	title: { type: String },
	imageTitle: { type: String },
	imagePath: { type: String },
	products: [productSchema],
});

module.exports = mongoose.model('NewArrival', typeSchema);

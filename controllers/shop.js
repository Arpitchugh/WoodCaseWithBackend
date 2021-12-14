// importing schema
const Type = require('../models/newArrivals');
const Collections = require('../models/collection');

exports.getHome = async (req, res) => {
	// content coming from schema
	const type = await Type.find();
	const collection = await Collections.find();

	res.render('index', {
		types: type,
		collections: collection,
	});
};

exports.getCollection = async (req, res) => {
	const type = await Type.find();
	const allCollections = await Collections.find();

	// get params from url
	const { title } = req.params;

	// get collection from db
	const collection = await Collections.findOne({ title: title });

	// render page
	res.render('collections', {
		types: type,
		collections: allCollections,
		collection: collection,
	});
};

// exports.getCaterpillar = (req, res) => {
// 	res.render('caterpillar');
// };

// exports.getArtisian = (req, res) => {
// 	res.render('artisian');
// };

exports.getShop = async (req, res) => {
	const type = await Type.find();
	const collection = await Collections.find();

	res.render('shop', {
		types: type,
		collections: collection,
	});
};

exports.getBuy = async (req, res) => {
    res.render('bed1')
}
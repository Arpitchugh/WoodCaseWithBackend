const multer = require('multer');

const productStorage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, 'uploads');
	},
	filename(req, file, cb) {
		cb(null, new Date().toDateString() + '-' + file.originalname);
	},
});

const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === 'image/png' ||
		file.mimetype === 'image/jpg' ||
		file.mimetype === 'image/jpeg'
	) {
		return cb(null, true);
	} else {
		return cb(null, false);
	}
};

module.exports = multer({
	storage: productStorage,
	fileFilter: fileFilter,
}).single('image');

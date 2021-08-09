/* --------------------------------- modules -------------------------------- */
dotenv = require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const csrf = require('csurf');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const authRoute = require('./routes/auth');
const shopRoute = require('./routes/shop');
const adminPanel = require('./routes/admin/adminPanel');
const adminNewArrivals = require('./routes/admin/newArrivals');
const adminCollection = require('./routes/admin/collection');

const app = express();

const store = new MongoDBStore({
	uri: process.env.DB,
	collection: 'sessions',
});

const csrfProtection = csrf();

/* ------------------------- essential/basic config ------------------------- */
app.set('view engine', 'ejs');
app.set('views', [
	path.join(__dirname, 'views'),
	path.join(__dirname, 'views/admin'),
	path.join(__dirname, 'views/admin/newArrivals'),
	path.join(__dirname, 'views/admin/collection'),
]);

/* ------------------------------- middleware ------------------------------ */
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
	session({
		secret: process.env.SESSION,
		resave: false,
		saveUninitialized: false,
		store: store,
		isLoggedIn: false,
	})
);

app.use(csrfProtection);

app.use(authRoute);
app.use(shopRoute);
app.use(adminPanel);
app.use('/admin', adminNewArrivals);
app.use('/admin', adminCollection);

module.exports = app;

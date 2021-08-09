dotenv = require('dotenv').config();
const mongoose = require('mongoose');

/* -------------------------------- database -------------------------------- */
mongoose.connect(process.env.DB, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

/* --------------------------------- server --------------------------------- */

const app = require('./app');

let port = process.env.PORT;
if (port == null || port == '') {
	port = 8000;
}
app.listen(port);

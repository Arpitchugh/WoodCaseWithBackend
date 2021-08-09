const User = require('../models/user');
const bcrypt = require('bcrypt');

/* --------------------------------- signup --------------------------------- */

exports.getSignup = (req, res) => {
	res.render('signup', {
		csrfToken: req.csrfToken(),
	});
};

exports.postSignup = async (req, res) => {
	try {
		const { firstName, lastName, email, password, confirmPassword } =
			await req.body;

		// validate password !== confirmPassword
		if (password !== confirmPassword) {
			return res.send('password does-not match with confirm password');
		}

		// check existing user
		const existingUser = await User.findOne({ email: email });

		if (existingUser) return res.send('user with this email already exists');

		// hash password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// create new user
		const user = await new User({
			firstName: firstName,
			lastName: lastName,
			email: email,
			password: hashedPassword,
		});

		user.save();
		res.redirect('/login');
	} catch (err) {
		if (err) throw new Error(err);
	}
};

/* ---------------------------------- login --------------------------------- */

exports.getLogin = (req, res) => {
	res.render('login', {
		csrfToken: req.csrfToken(),
		isLoggedIn: req.session.isLoggedIn,
		user: req.session.user,
	});
};

exports.postLogin = async (req, res) => {
	const { email, password } = req.body;

	try {
		// check for existing user
		const user = await User.findOne({ email: email });

		if (user) {
			// compare password
			const doMatch = await bcrypt.compare(password, user.password);

			// if password matches then login
			if (doMatch) {
				req.session.isLoggedIn = true;
				req.session.user = user;
				req.session.save();

				res.redirect('/');
			} else {
				res.send('incorrect password');
			}
		} else {
			res.send('user does not exist');
		}
	} catch (err) {
		if (err) throw new Error(err);
	}
};

exports.postLogout = (req, res) => {
	// destroy session to logout user
	req.session.destroy();

	res.redirect('/login');
};

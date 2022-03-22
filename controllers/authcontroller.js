const bcrypt = require('bcrypt');
const User = require('../models/User');
const Category = require('../models/Category');
const Course = require('../models/Course');
const { validationResult } = require('express-validator');

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    req.flash(
      'success',
      'Your registration has been successfully completed, you can login'
    );
    res.redirect('/login');
  } catch (err) {
    const errors = validationResult(req);
    for (let i = 0; i < errors.array().length; i++) {
      req.flash('error', `${errors.array()[i].msg}`);
    }
    res.redirect('/register');
  }
};

exports.loginUser = (req, res) => {
  try {
    const { email, password } = req.body;

    User.findOne({ email: email }, (err, user) => {
      if (user) {
        bcrypt.compare(password, user.password, (err, same) => {
          if (same) {
            //user session
            req.session.userID = user._id;
            res.status(200).redirect('dashboard');
          } else {
            req.flash('error', `Your password is not correct`);
            res.status(400).redirect('/login');
          }
        });
      } else {
        req.flash(
          'error',
          `User doesn't exist, please enter a valid email or register`
        );
        res.status(400).redirect('/login');
      }
    });
  } catch (err) {}
};

exports.logoutUser = (req, res) => {
  req.session.destroy(() => res.redirect('/'));
};

exports.getDashboardPage = async (req, res) => {
  const user = await User.findOne({ _id: req.session.userID }).populate(
    'courses'
  );
  const categories = await Category.find();
  const courses = await Course.find({ user: req.session.userID }).sort(
    '-createdAt'
  );
  const users = await User.find();
  res.status(200).render('dashboard', {
    page_name: 'dashboard',
    user,
    categories,
    courses,
    users,
  });
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    await Course.deleteMany({ user: req.params.id });
    req.flash('error', ` ${user.name} has been deleted successfully`);
    res.status(200).redirect('/users/dashboard');

   
  } catch (err) {}
};

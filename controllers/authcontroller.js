const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.redirect('/login');
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      err,
    });
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
            req.session.userID = user._id
            res.status(200).redirect('dashboard');
          } else {
            res.send('yanlis parola/mail');
          }
        });
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      err,
    });
  }
};

exports.logoutUser = (req,res) => {
  req.session.destroy(() => res.redirect('/'))
}

exports.getDashboardPage = async (req, res) => {
  const user = await User.findOne({_id: req.session.userID});

  res.status(200).render('dashboard', {
    page_name: 'dashboard',
    user
  });
};

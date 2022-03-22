const User = require('../models/User');
const nodemailer = require('nodemailer');

exports.getAboutPage = (req, res) => {
  res.status(200).render('about', {
    page_name: 'about',
  });
};

exports.getIndexPage = (req, res) => {
  console.log(req.session.userID);
  res.status(200).render('index', {
    page_name: 'index',
  });
};

exports.getContactPage = (req, res) => {
  res.status(200).render('contact', {
    page_name: 'contact',
  });
};

exports.getRegisterPage = (req, res) => {
  res.status(200).render('register', {
    page_name: 'register',
  });
};

exports.getLoginPage = async (req, res) => {
  const user = await User.findById(req.session.userID);
  res.status(200).render('login', {
    page_name: 'login',
    user,
  });
};

exports.sendEmail = async (req, res) => {
  try {
    const output = `
                  <h3> Mail details </h3>
                  <ul>
                      <li> Name: ${req.body.name} </li>
                      <li> Email: ${req.body.email}  </li>
                  </ul> 
                  <h4> Message </h4>
                  <p> ${req.body.message} </p> `;

    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'cz1e4md@gmail.com', // generated ethereal user
        pass: 'cahyfskfnybrwcvj', // generated ethereal password -APPLICATION PASSWORD
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: 'Smart Edu Contact" <cz1e4md@gmail.com>', // sender address
      to: 'cze_14@outlook.com', // list of receivers
      subject: 'Smart Edu Contact Form New Message ✔', // Subject line

      html: output, // html body
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    req.flash('success', 'We received your mail');
    res.status(200).redirect('contact');
  }
   catch (err) {
    req.flash('error', `An error occurred, error code: ${err}`);
  }
};

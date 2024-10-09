const nodemailer = require('nodemailer');

const smtpConfig = {
  //   host: 'smtp.gmail.com',
  //   port: 465,
  //   secure: true,
  //   ignoreTLS: true, // use SSL
  //   auth: {
  //     user: process.env.EMAIL_USERNAME,
  //     pass: process.env.EMAIL_PASSWORD,
  //   },

  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
};

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport(smtpConfig);

  // 2) Define the email options
  const mailOptions = {
    from: '<admin@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

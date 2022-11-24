const config = require("config");
const mail = require("nodemailer");
const trans = mail.createTransport(config.get("mail"));

function send(to, subject, text, html) {
  var mailOptions = {
    from: config.get("from"),
    to: to,
    subject: subject,
    text: text,
    html: html,
  };
  trans.sendMail(mailOptions, (error, info) => {
    if (error) console.log(error);
  });
}

module.exports = send;

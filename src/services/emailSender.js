// services/emailService.js

import { createTransport } from "nodemailer";

const mailTransporter = createTransport({
  service: "gmail",
  auth: {
    user: "narayan.socialseller@gmail.com",
    pass: "aare pqbf scwr yful",
  },
});

const mailSender = ({ to, subject, html }) => {
  console.log("entered mailSender")
  const details = {
    from: "shreyansh.socialseller@gmail.com",
    to: to,
    subject: subject,
    html: html,
  };
  // return mailTransporter.sendMail(details);
  return true
};

export  {
  mailSender,
};

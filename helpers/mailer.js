const nodemailer = require('nodemailer');
/**
 * Crea un transportador de correo electrónico utilizando la configuración de SMTP de Gmail.
 * Este objeto es responsable de la configuración y el envío de correos electrónicos.
 * @returns {Object} transporter - Un objeto transportador de Nodemailer configurado para enviar correos electrónicos.
 */
const transporter  = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for port 465, false for other ports
    auth: {
      user: process.env.GG_EMAIL,
      pass: process.env.GG_PASSWORD,
    },
  });

  module.exports = transporter

  
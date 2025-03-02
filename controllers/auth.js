const { response: res, request: req } = require('express')
const conexion = require('../database');
const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotallySecretKey');
const crypto = require('crypto');
const transporter = require('../helpers/mailer');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const auth = (req, res) => {
    const { correo, password, storeCredentials } = req.body;

    const sql = 'SELECT * FROM usuarios WHERE correo = ?';
    conexion.query(sql, [correo], async (error, results) => {
        let passwordHash = await bcrypt.hash('admin', 10);
        console.log(passwordHash);
        if (error) {
            res.status(500).json({
                msg: 'Error al autenticar',
                error: error.message
            });
            return;
        }
        console.log(results);

        if (results.length === 0) {
            res.status(400).json({
                msg: 'Revisa si sus credenciales son correctas'
            });
            return;
        }

        const user = results[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            res.status(400).json({
                msg: 'Credenciales no validas'
            });
            return;
        }
        if (user.verificado === 0) {
            res.status(400).json({
                msg: 'Verifica tu bandeja de correo'
            });
            return;
        }
        if (user.estado === 0) {
            res.status(403).json({
                msg: 'Su cuenta está inactiva. Contacte al administrador.'
            });
            return;
        }

        const token = jsonWebToken.sign({ user }, 'secretkey', { expiresIn: '1h' });

        if (storeCredentials) {
            const encryptedData = cryptr.encrypt(JSON.stringify({ correo, password }));
            res.cookie('remember_me', encryptedData, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true }); // 30 días
            console.log('Cookie remember_me creada:', encryptedData);
        } else {
            res.clearCookie('remember_me');
        }


        res.status(200).json({
            msg: 'Login correcto',
            token,
            user
        });

    })
}

async function verifyGoogleToken(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
}

const googleLogin = async (req, res) => {
    const { token } = req.body;
    try {
        const payload = await verifyGoogleToken(token);
        const sql = 'SELECT * FROM usuarios WHERE correo = ?';
        conexion.query(sql, [payload.email], (error, results) => {
            if (error) {
                return res.status(500).json({
                    msg: 'Error en la petición',
                    error: error.message,
                });
            }
            if (results.length === 0) {
                return res.status(404).json({
                    msg: 'Usuario no encontrado',
                });
            }
            const user = results[0];
            const jwtToken = jsonWebToken.sign({ user }, 'secretkey', { expiresIn: '1h' });
            res.status(200).json({
                msg: 'Login correcto',
                token: jwtToken,
                user,
            });
        });
    } catch (error) {
        res.status(400).json({
            msg: 'Error al autenticar con Google',
        });
    }
};



const forgotPassword = (req, res) => {
    const { correo } = req.body;
  
    if (!correo) {
      return res.status(400).json({ error: 'El correo es requerido' });
    }
  
    const query = `SELECT * FROM usuarios WHERE correo = ?`;
    conexion.query(query, [correo], (err, results) => {
      if (err) {
        console.error('Error en la consulta:', err);
        return res.status(500).send('Error al procesar la solicitud');
      }
  
      if (results.length === 0) {
        return res.status(400).json({ error: 'El correo no está registrado' });
      }
  
      const usuario = results[0];
      const token = crypto.randomBytes(20).toString('hex');
      const tokenExpiry = Date.now() + 3600000; // 1 hora
  
      const updateQuery = `UPDATE usuarios SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE usuario_id = ?`;
      conexion.query(updateQuery, [token, tokenExpiry, usuario.usuario_id], (updateErr) => {
        if (updateErr) {
          console.error('Error al guardar el token de restablecimiento:', updateErr);
          return res.status(500).send('Error al guardar el token de restablecimiento');
        }
  
        const resetLink = `https://talentos.pruebasdeploy.online/reset-password/${token}`;
        const mailOptions = {
          from: process.env.GG_EMAIL,
          to: correo,
          subject: 'Restablece tu contraseña',
          text: `Olvidaste tu contraseña?
          Por favor, restablece tu contraseña haciendo clic en el siguiente enlace: ${resetLink}`,
          html: `
            <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bienvenido</title>
          <style>
              .mail-container {
                  background-color: #ff;
                  padding: 20px;
                  border-radius: 10px;
                  max-width: 600px;
                  margin: 0 auto;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .mail-header {
                  background-color: #17223B;;
                  padding: 10px;
                  border-radius: 10px 10px 0 0;
                  text-align: center;
                  color: white;
              }
              .mail-content {
                  padding: 20px;
              }
              .verification-link {
                  background-color: #F37926;
                  color: white;
                  padding: 10px 20px;
                  text-decoration: none;
                  border-radius: 5px;
              }
              .mail-footer {
                  text-align: center;
                  font-size: 12px;
                  color: #777;
                  margin-top: 20px;
              }
          </style>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div class="mail-container">
              <div class="mail-header">
                  <h1 style="margin: 0;">¿Olvidaste tu contraseña?</h1>
              </div>
              <div class="mail-content">
                  <p>Estimado usuario,</p>
                  <p>Te enviamos este correo para que puedas restablecer tu contraseña.</p>
                  <p>Para continuar y elegir una nueva haz click en el siguiente enlace:</p>
                  
                  <a class="verification-link" href="${resetLink}">Ir a reestablecer contraseña</a>
              </div>
              <div class="mail-footer">
                  <p>&copy; 2024 Talento Inversiones. Todos los derechos reservados.</p>
              </div>
          </div>
      </body>
      </html>
          `
        };
  
        transporter.sendMail(mailOptions, (error) => {
          if (error) {
            return res.status(500).send('Error al enviar el correo de restablecimiento');
          }
          res.cookie('resetToken', token, { maxAge: 3600000, httpOnly: true });
          res.send('Correo de restablecimiento enviado. Revisa tu bandeja de entrada.');
        });
      });
    });
  };
  


const resetPassword = (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    // Asegúrate de que el token y la contraseña estén presentes
    if (!token || !password) {
        return res.status(400).json({ error: 'Token o contraseña faltante' });
    }

    const query = `SELECT * FROM usuarios WHERE resetPasswordToken = ? AND resetPasswordExpires > ?`;
    conexion.query(query, [token, Date.now()], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        }
        if (results.length === 0) {
            return res.status(400).json({ error: 'El token es inválido o ha expirado' });
        }

        const usuario = results[0];
        bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
            if (hashErr) {
                console.error('Error al hashear la contraseña:', hashErr);
                return res.status(500).json({ error: 'Error al hashear la nueva contraseña' });
            }
            const updateQuery = `UPDATE usuarios SET password = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE usuario_id = ?`;
            conexion.query(updateQuery, [hashedPassword, usuario.usuario_id], (updateErr) => {
                if (updateErr) {
                    console.error('Error al actualizar la contraseña:', updateErr);
                    return res.status(500).json({ error: 'Error al guardar la nueva contraseña' });
                }
                res.json({ message: 'Contraseña restablecida exitosamente' });
            });
        });
    });
};


const resetPasswordForm = (req, res) => {
    const { token } = req.params;
    
    // Aquí podrías agregar lógica para verificar si el token es válido
    // y si ha expirado, si es necesario.

    res.json({ valid: true, token }); // Indica que el token es válido y envía el token al frontend
};

const updatePassword = (req, res) => {
    const { correo, oldPassword, newPassword } = req.body;

    if (!correo || !oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const query = 'SELECT * FROM usuarios WHERE correo = ?';
    conexion.query(query, [correo], async (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ error: 'Error en la consulta a la base de datos' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const usuario = results[0];
        const validPassword = await bcrypt.compare(oldPassword, usuario.password);

        if (!validPassword) {
            return res.status(400).json({ error: 'Contraseña antigua incorrecta' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        const updateQuery = 'UPDATE usuarios SET password = ? WHERE correo = ?';
        conexion.query(updateQuery, [hashedNewPassword, correo], (updateErr) => {
            if (updateErr) {
                console.error('Error al actualizar la contraseña:', updateErr);
                return res.status(500).json({ error: 'Error al actualizar la contraseña' });
            }

            res.json({ message: 'Contraseña actualizada exitosamente' });
        });
    });
};

      
module.exports = {
    auth,
    googleLogin,
    forgotPassword, 
    resetPassword,
    resetPasswordForm,
    updatePassword
}


      


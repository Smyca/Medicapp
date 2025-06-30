// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Reemplaza estos valores con los tuyos de Twilio
const accountSid = 'AC9e8331e12987976ea5e1018104ad97bc';
const authToken = 'a34766c96645ecb20f1d5a206365525a';
const twilioNumber = '+1 912 915 0794';

const client = twilio(accountSid, authToken);

app.post('/panic-call', async (req, res) => {
  const { to } = req.body;
  try {
    await client.calls.create({
      url: 'http://localhost:3001/twiml', // Cambia esto por tu IP local o dominio real
      to,
      from: twilioNumber,
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// <-- AQUÍ pega el endpoint TwiML
app.get('/twiml', (req, res) => {
  res.type('text/xml');
  res.send(`
    <Response>
      <Say voice="alice" language="es-ES">
        ¡Alerta! Este es un mensaje automático de MedicApp. El usuario ha activado el botón de pánico y podría estar en una situación de emergencia. Por favor, intenta contactarlo de inmediato.
      </Say>
    </Response>
  `);
});



app.listen(3001, () => {
  console.log('Twilio Panic Call backend running on port 3001');
});
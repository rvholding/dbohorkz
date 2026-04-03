const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const FLASK_API_URL = process.env.FLASK_API_URL || 'http://localhost:5000';

// Inicializar cliente WhatsApp
const client = new Client({
  authStrategy: new LocalAuth()
});

let isReady = false;

// Eventos del cliente
client.on('qr', (qr) => {
  console.log('📱 QR Code:');
  qrcode.generate(qr, { small: true });
  console.log('Escanea el código QR con tu teléfono');
});

client.on('ready', () => {
  console.log('✅ Cliente WhatsApp conectado');
  isReady = true;
});

client.on('authenticated', () => {
  console.log('🔐 Autenticado exitosamente');
});

client.on('auth_failure', (msg) => {
  console.error('❌ Error de autenticación:', msg);
  isReady = false;
});

client.on('disconnected', (reason) => {
  console.log('⚠️ Cliente desconectado:', reason);
  isReady = false;
});

// Procesar mensajes entrantes
client.on('message_create', async (message) => {
  // Ignorar mensajes del bot
  if (message.fromMe) return;

  const phoneNumber = message.from;
  const userMessage = message.body;

  console.log(`📨 Mensaje de ${phoneNumber}: ${userMessage}`);

  try {
    // Enviar a Flask para procesar
    const response = await axios.post(`${FLASK_API_URL}/api/chatbot/message`, {
      message: userMessage,
      user_id: phoneNumber,
      platform: 'whatsapp'
    });

    const botResponse = response.data.bot_response;

    // Simular escritura
    await new Promise(r => setTimeout(r, parseInt(process.env.TYPING_DELAY) || 1000));

    // Enviar respuesta
    await message.reply(botResponse);
    console.log(`✉️  Respuesta enviada a ${phoneNumber}`);

  } catch (error) {
    console.error('Error procesando mensaje:', error.message);
    
    // Enviar mensaje de error
    if (isReady) {
      await message.reply(
        'Disculpa, hubo un error procesando tu mensaje. Por favor intenta de nuevo.'
      );
    }
  }
});

// Rutas REST API
app.get('/api/health', (req, res) => {
  res.json({
    status: isReady ? 'connected' : 'disconnected',
    timestamp: new Date()
  });
});

app.get('/api/info', (req, res) => {
  res.json({
    service: 'WhatsApp Chatbot Service',
    version: '1.0.0',
    status: isReady ? 'ready' : 'initializing',
    flask_api: FLASK_API_URL
  });
});

app.post('/api/send-message', async (req, res) => {
  const { phone, message } = req.body;

  if (!phone || !message) {
    return res.status(400).json({ error: 'phone y message son requeridos' });
  }

  if (!isReady) {
    return res.status(503).json({ error: 'Cliente WhatsApp no está listo' });
  }

  try {
    const chatId = phone.includes('@') ? phone : `${phone}@c.us`;
    await client.sendMessage(chatId, message);
    
    res.json({
      success: true,
      phone,
      message,
      sent_at: new Date()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Servidor WhatsApp corriendo en puerto ${PORT}`);
});

// Iniciar cliente WhatsApp
client.initialize();

// Manejo de cierre
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando cliente...');
  await client.destroy();
  process.exit(0);
});

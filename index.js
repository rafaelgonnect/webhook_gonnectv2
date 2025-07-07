require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');

// --- Configuração Essencial ---
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// --- Validações Iniciais ---
if (!MONGODB_URI) {
  console.error('ERRO: A variável de ambiente MONGODB_URI não está definida.');
  process.exit(1);
}

// --- Modelos do Mongoose (Schema Simplificado) ---
const WebhookEventSchema = new mongoose.Schema({
  receivedAt: { type: Date, default: Date.now },
  payload: { type: mongoose.Schema.Types.Mixed },
});
const WebhookEvent = mongoose.model('WebhookEvent', WebhookEventSchema);

// --- Conexão com o Banco de Dados ---
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB conectado com sucesso.');
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error.message);
    process.exit(1);
  }
};

// --- Aplicação Express ---
const app = express();

// Middlewares de Segurança e Parsing
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// --- Rotas ---

// Rota Raiz: Informações básicas
app.get('/', (req, res) => {
  res.json({
    service: 'Webhook V2',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString(),
  });
});

// Rota de Health Check para o Easypanel
app.get('/health', (req, res) => {
  // Verifica o status da conexão com o MongoDB
  const isMongoConnected = mongoose.connection.readyState === 1;
  
  if (isMongoConnected) {
    res.status(200).json({ status: 'ok', db: 'connected' });
  } else {
    res.status(503).json({ status: 'error', db: 'disconnected' });
  }
});

// Rota Principal do Webhook
app.post('/webhook', async (req, res) => {
  try {
    console.log('📥 Webhook recebido:', JSON.stringify(req.body, null, 2));

    // Salva o evento completo no banco de dados
    const event = new WebhookEvent({ payload: req.body });
    await event.save();

    res.status(200).json({ success: true, message: 'Webhook processado.' });

  } catch (error) {
    console.error('❌ Erro ao processar o webhook:', error.message);
    res.status(500).json({ success: false, error: 'Erro interno do servidor.' });
  }
});

// Middleware para Rotas Não Encontradas (404)
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint não encontrado.' });
});

// --- Inicialização do Servidor ---
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`🔗 Endpoint do Webhook: http://localhost:${PORT}/webhook`);
    console.log(`❤️ Health Check: http://localhost:${PORT}/health`);
  });
};

startServer();
